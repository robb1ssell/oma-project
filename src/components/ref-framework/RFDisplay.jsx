import React, {useState, useEffect} from 'react';
import ReactMarkdown from 'react-markdown'
import Axios from 'axios';
//import ReactHtmlParser from 'react-html-parser'
import { HashLink as Link } from 'react-router-hash-link'
import stickybits from 'stickybits'
import moment from 'moment'
import Issues from './Issues';
import Commit from './Commit';

// id from file data is needed to pull from API
// set the file data to state and then create the table of contents
const getRaw = (sha, setRawMarkdown, setToc) => {
  Axios.get({/* Removed due to contract */})
  .then(res => {
    setRawMarkdown(res.data);
    createTOC(setToc);
    addTocHeaderIds();
  })
}

// gets open issues from repo and build array of info for Issues Component
// issueMatch is a string following the format: 'item level folder/item.md' and is generated from url params
// the user must include this in the description of the issue on gitlab
// the directive for creating issue will request the user provide this information


// grabs commits for the file displayed
// API returns in newest first order, so we only want the first 3 items going to state
const getCommits = (setCommits, paramPath) => {
  let temp = []
  Axios.get({/* Removed due to contract */})
  .then(res => {
    res.data.forEach(commit => {
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

const RFDisplay = props => {
  const params = props.match.params;
  const [rawMarkdown, setRawMarkdown] = useState();
  const [toc, setToc] = useState();
  const [issues, setIssues] = useState([]);
  const [commits, setCommits] = useState([]);

  useEffect(() => {
    stickybits('#left-sidenav-inner', {stickyBitStickyOffset: 85, useStickyClasses: true});
    stickybits('#right-sidenav-inner', {stickyBitStickyOffset: 85, useStickyClasses: true});
  }, [])

  useEffect(() => {
    document.title = `OMA | EMAF RF | ${params.filename}`
  }, [params])

  useEffect(() => {
    let paramPath = `${params.type}/${params.category}/${params.filename}`
    const getData = async () => {
      const res = await Axios.get({/* Removed due to contract */})
      res.data.forEach(el => {
        if (el.type === 'blob') {
          let fileExt = el.name.split('.').pop();
          if (fileExt === 'md' && el.name.charAt(0) !== '.') {
            if (el.path === paramPath) {
              getRaw(el.id, setRawMarkdown, setToc);
              getCommits(setCommits, paramPath);
            }
          }
        }
      })
    }
    getData()
  }, [params])

  useEffect(() => {
    let issueMatch = `${params.itemfolder}/${params.filename}`
    const getIssueData = async () => {
      let temp = [];
      const issues = await Axios.get({/* Removed due to contract */});
      issues.data.forEach(issue => {
        if (temp.length < 3) { // cap the amount of items at 3
          if (issue.description.includes(issueMatch)) {
            getCommentCount(issue)
            .then(commentCount => {
              temp.push(
                {
                  title: issue.title,
                  issueNumber: issue.iid,
                  created: moment(issue.created_at).format('MM-DD-YY'),
                  lastUpdate: moment(issue.updated_at).fromNow(),
                  upvotes: issue.upvotes,
                  downvotes: issue.downvotes,
                  url: issue.web_url,
                  comments: commentCount,
                }
              )
              setIssues(temp)
            })
          }
        }
      })
    }
    
    const getCommentCount = async (issue) => {
      let commentCount = 0;
      const comments = await Axios.get({/* Removed due to contract */});
      comments.data.forEach(comment => {
        if (comment.system === false) {
          commentCount++;
        }
      })
      return commentCount;
    }

    getIssueData()
  }, [params])

  return (
    <div className='container subPage'>
      <div className="row">
        <div className="col-12 col-lg-2 sidenavWrapper">
          <div id="left-sidenav-inner">
            <ul>
              {toc}
            </ul>
          </div>
        </div>
        <div id='markdown-wrapper' className="col-12 col-lg-8">
          <ReactMarkdown source={rawMarkdown}/>
        </div>
        <div className="col-12 col-lg-2 sidenavWrapper">
          <div id="right-sidenav-inner">
            <a href={/* Removed due to contract */}
              target='_blank'
              rel='noopener noreferrer'
            >
              <h5 className='blueText'>
                Create an Issue
              </h5>
            </a>
            <div id="rf-file-open-issues" className='mt-5'>
              <div className="em-c-text-passage">
                <h4 className='mb-0 mt-0'>Open Issues</h4>
              </div>
              {
                issues.length > 0 ?
                <Issues issues={issues}/>
                :
                ''
              }
              
            </div>
            <div id="rf-file-recent-commits" className='mt-5'>
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

export default RFDisplay;