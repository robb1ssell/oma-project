import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import ReactMarkdown from 'react-markdown'
import htmlParser from 'react-markdown/plugins/html-parser'
//import ReactHtmlParser from 'react-html-parser'
import { HashLink as Link } from 'react-router-hash-link'
import stickybits from 'stickybits'
import moment from 'moment'
import Issues from '../Issues';
import Commit from '../Commit';
import CodeRenderer from './CodeRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const fileBlacklist = [
  'readme',
  'changelog',
  'index'
];

// add tags coming from .md as valid here
// https://github.com/rexxars/react-markdown#parsing-html
// See https://github.com/aknuds1/html-to-react#with-custom-processing-instructions
// for more info on the processing instructions
const parseHtml = htmlParser({
  isValidNode: node => node.type === 'break'
})

// id from file data is needed to pull from API
// set the file data to state and then create the table of contents
const getRaw = (sha, setRawMarkdown, setToc, projectId, repoUrl) => {
  fetch(`/api/gitlab/get-raw-file?sha=${sha}&projectId=${projectId}`)
  .then(response => response.text())
  .then(rawMd => fixRelativeLinks(rawMd, repoUrl))
  .then(md => {
    setRawMarkdown(md);
    createTOC(setToc);
    addTocHeaderIds();
  })
}

// grabs commits for the file displayed
// API returns in newest first order, so we only want the first 3 items going to state
const getCommits = (setCommits, projectId) => {
  let temp = []
  fetch(`/api/gitlab/commits?projectId=${projectId}`)
  .then(response => response.text())
  .then(dataStr => JSON.parse(dataStr))
  .then(commits => {
    commits.forEach(commit => {
      if (temp.length < 3) {
        temp.push(
          {
            message: commit.message,
            id: commit.short_id,
            date: commit.created_at
          }
        )
      }
    })
    setCommits(temp)
  })
}

//Allows user to utilize relative file paths in git repo
//Finds all links in the markdown, parses out the relative links
// and replaces them with the full url
const fixRelativeLinks = (md, repoUrl) => {
  let newMD = md;
  const regexMdLinks = /\[([^[]+)\](\(.*\))/gm
  const matches = newMD.match(regexMdLinks)

  const singleMatch = /\[([^[]+)\]\((.*)\)/
  for (let i = 0; i < matches.length; i++) {
    let text = singleMatch.exec(matches[i])
    let link = text[2].split(' ')[0];
    if (link.slice(0,8) !== 'https://') {
      newMD = newMD.replace(link, `${repoUrl}/raw/master/${link}`)
    }
  }
  return newMD;
}

// list item markup for table of contents list items
const createLi = (el, i) => {
  let tocLevel = '';
  if (el.localName === 'h2') {
    tocLevel = 'tocParent'
  }
  else {
    tocLevel = 'tocChild'
  }
  return (
    <li className={tocLevel} key={`tocItem-${i}`}>
      <Link 
        to={`#${el.innerText}`}
        scroll={el => {
          const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
          const yOffset = -70;

          window.scrollTo({
              top: yCoordinate + yOffset,
              behavior: 'smooth'
          });
        }}
      >
        {el.innerText}
      </Link>
    </li>
  )
}

// gets all the children of the markdown container and 
// builds an array of list items and sub list items
// only uses h2 and h3 for content headers
const createTOC = (setToc) => {
  let tocMarkup = [];
  let els = [...document.getElementById('markdown-wrapper').children];

  els.forEach((el, i) => {
    if (el.localName === 'h2' || el.localName === 'h3') {
      let li = createLi(el, i);
      tocMarkup.push(li);
    }
  })
  setToc(tocMarkup)
}

// adds id to table of content headers to be used for hash link targets
const addTocHeaderIds = () => {
  let tocHeaders = [...document.querySelectorAll('h2, h3')];

  tocHeaders.forEach(el => {
    el.id = el.innerHTML;
  })
}

const MarkdownDisplay = props => {
  const params = props.match.params;
  const [rawMarkdown, setRawMarkdown] = useState();
  const [toc, setToc] = useState();
  const [issues, setIssues] = useState();
  const [commits, setCommits] = useState([]);
  const [repoData, setRepoData] = useState({});
  let history = useHistory();

  const goBackToRF = () => {
    history.push("/emaf/reference-framework");
  }

  useEffect(() => {
    stickybits('.sidenav', {stickyBitStickyOffset: 85});
  }, [])

  useEffect(() => {
    document.title = `OMA | EMAF RF | ${repoData.name}`
  }, [repoData])

  useEffect(() => {
    fetch(`/api/gitlab/repo-data?projectId=${params.projectId}`)
      .then(response => response.text())
      .then(dataStr => JSON.parse(dataStr))
      .then(data => {
        setRepoData(data)
      })
  }, [params])

  useEffect(() => {
    if (repoData.web_url) {
      fetch(`/api/gitlab/repo-file-tree?projectId=${params.projectId}`)
        .then(response => response.text())
        .then(dataStr => JSON.parse(dataStr))
        .then(files => {
          files.forEach(el => {
            if (el.type === 'blob') {
              // get file extension because we want to filter down to markdown only
              let fileExt = el.name.split('.').pop();
              // if it's markdown, not a hidden file, and the name is not in the blacklist at the top of this file
              if (fileExt === 'md' && el.name.charAt(0) !== '.' && fileBlacklist.indexOf(el.name.substr(0, el.name.lastIndexOf('.')).toLowerCase()) === -1) {
                //console.log(el)
                getRaw(el.id, setRawMarkdown, setToc, params.projectId, repoData.web_url);
                getCommits(setCommits, params.projectId);
              }
            }
          })
        })
    }
  }, [params, repoData])

  useEffect(() => {
    let temp = [];
    fetch(`/api/gitlab/issues?projectId=${params.projectId}`)
      .then(response => response.text())
      .then(dataStr => JSON.parse(dataStr))
      .then(issues => {
        issues.forEach(issue => {
          if (temp.length < 3) { // cap the amount of items at 3
            temp.push(
              {
                title: issue.title,
                issueNumber: issue.iid,
                created: moment(issue.created_at).format('MM-DD-YY'),
                lastUpdate: moment(issue.updated_at).fromNow(),
                upvotes: issue.upvotes,
                downvotes: issue.downvotes,
                url: issue.web_url,
                commentCount: issue.user_notes_count,
              }
            )
          }
        })
        //console.log(temp)
        setIssues(temp)
      })
  }, [params])

  return (
    <div className='container-fluid subPage mb-5'>
      <div className="row">
        <div className="col-12 col-lg-2 sidenavWrapper">
          <div className="sidenav">
            <div className='mb-4 pointer' onClick={goBackToRF}>
              <FontAwesomeIcon icon={['fas', 'arrow-left']}/>
              <span className='pl-3'>Back To List</span>
            </div>
            <ul>
              {toc}
            </ul>
          </div>
        </div>
        <div id='markdown-wrapper' className="col-12 col-lg-8">
          <ReactMarkdown
            source={rawMarkdown}
            astPlugins={[parseHtml]}
            escapeHtml={false}
            renderers={{
              code: CodeRenderer,
              inlineCode: CodeRenderer,
            }}
          />
        </div>
        <div className="col-12 col-lg-2 sidenavWrapper">
          <div className="sidenav">
            <a href={{/* Removed due to contract */}}
              target='_blank'
              rel='noopener noreferrer'
            >
              <h5 className='blueText'>
                Submit an Issue
              </h5>
            </a>
            <div id="rf-file-open-issues" className='mt-5'>
              <div className="em-c-text-passage">
                <h4 className='mb-0 mt-0'>Open Issues</h4>
              </div>
              <div className="d-flex justify-content-center openIssues">
                {
                  issues ? 
                    <Issues issues={issues}/>
                  :
                    ''
                }
              </div>
            </div>
            <div id="rf-file-recent-commits" className='mt-3'>
              <div className="em-c-text-passage">
                <h4 className='mb-0 mt-0'>Latest Commits</h4>
              </div>
              <div id="commits-list" className='mt-3'>
                {
                  commits.map(el => (
                    <Commit commit={el} key={el.id}/>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownDisplay;