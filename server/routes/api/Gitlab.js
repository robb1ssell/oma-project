const https = require('https')
const config = require('../../config');
const access_token = config.gitlabToken;
const apiUrl = config.gitlabApiUrl;

const gitlabOptions = {
  rejectUnauthorized: false
}

module.exports = app => {
  //lookup for gitlab user
  app.get('/api/gitlab/user-search', (req, res) => {
    let username = req.query.username;

    https.get(`${apiUrl}/users?search=${username}&access_token=${access_token}`, gitlabOptions, (r) => {
      //console.log('statusCode:', resp.statusCode);
      //console.log('headers:', resp.headers);
      r.on('data', (d) => {
        res.send(JSON.parse(d));
      });
    }).on('error', (e) => {
      console.error(e);
    });
  })

  //gets list of projects a specific user has starred
  app.get('/api/gitlab/user-stars', (req, res) => {
    let id = req.query.id;

    https.get(`${apiUrl}/users/${id}/starred_projects?simple=true&access_token=${access_token}`, gitlabOptions, (r) => {
      r.on('data', (d) => {
        res.send(JSON.parse(d));
      });
    }).on('error', (e) => {
      console.error(e);
    });
  })
  
  //gets all project data for EMAF group and subgroups
  app.get('/api/gitlab/group-projects', (req, res) => {
    let subgroups = req.query.include_subgroups;
    let groupId = req.query.groupId;

    https.get(`${apiUrl}/groups/${groupId}/projects?${subgroups ? 'include_subgroups=true':''}&access_token=${access_token}`, gitlabOptions, (r) => {
      const { statusCode } = r;
      const contentType = r.headers['content-type'];

      let error;
      if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error('Invalid content-type.\n' +
                          `Expected application/json but received ${contentType}`);
      }
      if (error) {
        console.error(error.message);
        // Consume response data to free up memory
        r.resume();
        return;
      }

      r.setEncoding('utf8');
      let rawData = '';
      r.on('data', (chunk) => { rawData += chunk; });
      r.on('end', () => {
        try {
          res.send(rawData);
        } catch (e) {
          console.error(e.message);
        }
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });
  })

  //handles both starring and unstarring a repo
  app.post('/api/gitlab/star-action', (req, res) => {
    let action = req.query.action;
    let projectId = req.query.projectId;

    const starOptions = {
      method: 'post',
      port: 443,
      rejectUnauthorized: false
    }

    const request = https.request(`${apiUrl}/projects/${projectId}/${action}?access_token=${access_token}`, starOptions, (r) => {
      console.log('statusCode:', r.statusCode);
      res.send(`Star code: ${r.statusCode}`);
    });

    request.on('error', (e) => {
      console.error(e);
    });

    request.end();
  })

  //get raw data from file using sha of file
  //used to get markdown
  app.get('/api/gitlab/get-raw-file', (req, res) => {
    let projectId = req.query.projectId;
    let sha = req.query.sha;

    https.get(`${apiUrl}/projects/${projectId}/repository/blobs/${sha}/raw?access_token=${access_token}`, gitlabOptions, (r) => {
      let rawData = '';
      r.on('data', (chunk) => { rawData += chunk; });
      r.on('end', () => {
        try {
          res.send(rawData);
        } catch (e) {
          console.error(e.message);
        }
      });
    }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
    });
  })

  //get commits for a repo
  app.get('/api/gitlab/commits', (req, res) => {
    let projectId = req.query.projectId;

    https.get(`${apiUrl}/projects/${projectId}/repository/commits?access_token=${access_token}`, gitlabOptions, (r) => {
      r.on('data', (d) => {
        res.send(JSON.parse(d));
      });
    }).on('error', (e) => {
      console.error(e);
    });
  })

  //get data for a repo
  app.get('/api/gitlab/repo-data', (req, res) => {
    let projectId = req.query.projectId;

    https.get(`${apiUrl}/projects/${projectId}?access_token=${access_token}`, gitlabOptions, (r) => {
      r.on('data', (d) => {
        res.send(JSON.parse(d));
      });
    }).on('error', (e) => {
      console.error(e);
    });
  })
  
  app.get('/api/gitlab/repo-file-tree', (req, res) => {
    let projectId = req.query.projectId;
  
    https.get(`${apiUrl}/projects/${projectId}/repository/tree?recursive=true&per_page=1000&access_token=${access_token}`, gitlabOptions, (r) => {
      r.on('data', (d) => {
        res.send(JSON.parse(d));
      });
    }).on('error', (e) => {
      console.error(e);
    });
  })

  app.get('/api/gitlab/issues', (req, res) => {
    let projectId = req.query.projectId;
    
    https.get(`${apiUrl}/projects/${projectId}/issues?state=opened&access_token=${access_token}`, gitlabOptions, (r) => {
      r.on('data', (d) => {
        res.send(JSON.parse(d));
      });
    }).on('error', (e) => {
      console.error(e);
    });
  })
  
  app.get('/api/gitlab/issue-comment-count', (req, res) => {
    let issueId = req.query.issueId;
    let projectId = req.query.projectId;
  
    https.get(`${apiUrl}/projects/${projectId}/issues/${issueId}/notes?access_token=${access_token}`, gitlabOptions, (r) => {
      r.on('data', (d) => {
        res.send(JSON.parse(d));
      });
    }).on('error', (e) => {
      console.error(e);
    });
  })
}