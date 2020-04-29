import React, {useState, useEffect, useCallback} from 'react';
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import sp from 'utils/sharepoint'

const FileBlock = props => {
  let splitFilePath = props.file.path.split('/');
  //console.log(splitFilePath)
  let archType = splitFilePath[0];
  let category = splitFilePath[1];
  let fileName = splitFilePath[2];
  const voteList = 'OMA_EMAF_RF_Voting';
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [netVotes, setNetVotes] = useState(0);
  const [voteRecord, setVoteRecord] = useState();

  const getVotes = useCallback(() => {
    let net = 0;
    sp.web.lists.getByTitle(voteList).items.getAll()
    .then(votes => {
      //console.log(votes)
      votes.forEach(vote => {
        if (vote.UserId === props.userId && vote.Arch_Type === archType && vote.Category === category && vote.Title === fileName) {
          setVoteRecord(vote)
          if (vote.Vote_Direction === 'Up') {
            net += 1;
            setUpvoted(true);
            setDownvoted(false);
          }
          if (vote.Vote_Direction === 'Down') {
            net -= 1;
            setDownvoted(true);
            setUpvoted(false);
          }
        }
      })
      setNetVotes(net);
    })
  }, [props, fileName, category, archType])

  useEffect(() => {
    getVotes();
  }, [getVotes])
  
  // Upvote Handler
  const handleUpvote = () => {
    // state will be set according to server records
    if (upvoted === true) {
      // if already an upvote, send delete for record
      if (voteRecord) {
        sp.web.lists.getByTitle(voteList).items.getById(voteRecord.Id).delete().then(_ => {
          setUpvoted(false);
          setVoteRecord();
          getVotes();
        })
      } else {
        // if not upvote, update the record from downvote to upvote
        sp.web.lists.getByTitle(voteList).items.getById(voteRecord.Id).update({
          Arch_Type: archType,
          Category: category,
          Title: fileName,
          UserId: props.userId,
          Vote_Direction: 'Up',
        }).then(i => {
          console.log(i)
          setUpvoted(true);
          setDownvoted(false);
          getVotes();
        })
      }
    }
    else {
      if (voteRecord) {
        // if not upvote, update the record from downvote to upvote
        sp.web.lists.getByTitle(voteList).items.getById(voteRecord.Id).update({
          Arch_Type: archType,
          Category: category,
          Title: fileName,
          UserId: props.userId,
          Vote_Direction: 'Up',
        }).then(i => {
          console.log(i)
          setUpvoted(true);
          setDownvoted(false);
          getVotes();
        })
      } else {
        // if no record, send add for upvote
        sp.web.lists.getByTitle(voteList).items.add({
          Arch_Type: archType,
          Category: category,
          Title: fileName,
          UserId: props.userId,
          Vote_Direction: 'Up',
        }).then(i => {
          console.log(i)
          setUpvoted(true);
          setDownvoted(false);
          getVotes();
        })
      }
    }
  }
  // Downvote Handler
  const handleDownvote = () => {
    // state will be set according to server records
    if (downvoted === true) {
      // if already an upvote, send delete for record
      if (voteRecord) {
        sp.web.lists.getByTitle(voteList).items.getById(voteRecord.Id).delete().then(_ => {
          setDownvoted(false);
          setVoteRecord();
          getVotes();
        })
      } else {
        // if not upvote, update the record from downvote to upvote
        sp.web.lists.getByTitle(voteList).items.getById(voteRecord.Id).update({
          Arch_Type: archType,
          Category: category,
          Title: fileName,
          UserId: props.userId,
          Vote_Direction: 'Down',
        }).then(i => {
          console.log(i)
          setDownvoted(true);
          setUpvoted(false);
          getVotes();
        })
      }
    }
    else {
      if (voteRecord) {
        // if there is a record and it is not downvote, update the record from downvote to upvote
        sp.web.lists.getByTitle(voteList).items.getById(voteRecord.Id).update({
          Arch_Type: archType,
          Category: category,
          Title: fileName,
          UserId: props.userId,
          Vote_Direction: 'Down',
        }).then(i => {
          console.log(i)
          setDownvoted(true);
          setUpvoted(false);
          getVotes();
        })
      } else {
        // if no record, send add for upvote
        sp.web.lists.getByTitle(voteList).items.add({
          Arch_Type: archType,
          Category: category,
          Title: fileName,
          UserId: props.userId,
          Vote_Direction: 'Down',
        }).then(i => {
          console.log(i)
          setDownvoted(true);
          setUpvoted(false);
          getVotes();
        })
      }
    }
  }

  return (
    <div className="row">
      <div className='col-12 '>
        <div className="col-12 blockWithShadow d-flex align-items-center flex-wrap">
            {
              props.file.path.split('/')[0] === 'Reference Architecture' ?
              <div className="fileAbbrev fileAbbrev-blue d-flex align-items-center justify-content-center">
                <h5>RA</h5>
              </div>
              :
              props.file.path.split('/')[0] === 'Reference Implementation' ?
              <div className="fileAbbrev fileAbbrev-green d-flex align-items-center justify-content-center">
                <h5>RI</h5>
              </div>
              :
              props.file.path.split('/')[0] === 'Reference Model' ?
              <div className="fileAbbrev fileAbbrev-red d-flex align-items-center justify-content-center">
                <h5>RM</h5>
              </div>
              :
              ''
            }
            <div className='pb-3 pt-3'>
              <Link 
                to={`/emaf/reference-framework/${props.file.path}`}
                className='d-flex align-items-center'
              >
                  <h3 className='mb-0'>
                    {props.file.name.split('.')[0]}
                  </h3>
              </Link>
              <div className='d-flex mt-3'>
                <h5 className='mb-0'>{`${props.file.path.split('/')[0]} | ${props.file.path.split('/')[1].split(' ')[0]}`}</h5>
              </div>
            </div>
            <div className="votingBtns d-flex flex-row ml-auto">
              <div className='d-flex flex-row align-items-center'>
                <FontAwesomeIcon icon={['far', 'arrow-alt-circle-down']} color={downvoted ? 'red' : 'black'} size='2x' 
                  onClick={handleDownvote}
                  className='pointer'
                  />
              </div>
              <p className='pl-3 pr-3 mb-0'>{netVotes}</p>
              <div className='d-flex flex-row align-items-center'>
                <FontAwesomeIcon icon={['far', 'arrow-alt-circle-up']} color={upvoted ? 'blue' : 'black'} size='2x'
                  onClick={handleUpvote}
                  className='pointer'
                />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FileBlock;