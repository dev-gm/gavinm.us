const express = require('express');
const exphbs = require('express-handlebars');
const axios = require('axios');
const moment = require('moment')
const path = require('path');
const {
    json
} = require('express');

const app = express();

const username = 'dev-gm';
const token = 'b7ccb434e0b11f93baad67e58a97f61de921eb30'

const port = 80;

const get_data = () => {
    user_headers = {
        url: 'https://api.github.com/users/' + username,
        method: 'GET',
        accept: 'text/json',
        client_id: username,
        token: token
    };
    repo_headers = {
        url: 'https://api.github.com/users/' + username + '/repos',
        method: 'GET',
        accept: 'text/json',
        client_id: username,
        token: token
    };
    let data = axios(repo_headers)
        .then((raw_data) => {
            data = raw_data.data
            projects = [];
            for (i = 0; i < data.length; i++) {
                datum = data[i];
                project = {
                    url: datum.svn_url,
                    name: datum.name,
                    desc: datum.description,
                    committed: datum.pushed_at.slice(11, 18) + ', ' + datum.pushed_at.slice(0, 9),
                    lang: datum.language,
                    size: datum.size + ' kilobytes'
                }
                projects.push(project)
            }
            return projects;
        }).then((repos) => {
            return axios(user_headers)
                .then((raw_data) => {
                    let user = raw_data.data;
                    return {
                        url: user.blog,
                        name: user.name,
                        about: user.bio,
                        contact: {
                            github: {
                                link: user.html_url,
                                name: user.login
                            },
                            email: user.user,
                            phone: '+13016643907'
                        },
                        skills: [{
                                icon: 'icon1',
                                title: 'title1',
                                desc: 'desc1'
                            },
                            {
                                icon: 'icon1',
                                title: 'title1',
                                desc: 'desc1'
                            },
                            {
                                icon: 'icon1',
                                title: 'title1',
                                desc: 'desc1'
                            }
                        ],
                        projects: repos,
                        history: [{
                                title: 'Python',
                                date: '2017-2018'
                            },
                            {
                                title: 'HTML and CSS',
                                date: '2018'
                            },
                            {
                                title: 'Front-End JavaScript',
                                date: '2019'
                            },
                            {
                                title: 'Java and ExpressJS',
                                date: '2020'
                            }
                        ],
                        socials: [{
                                name: 'linkedin',
                                link: 'linkedin.com'
                            },
                            {
                                name: 'twitter',
                                link: 'twitter.com'
                            },
                            {
                                name: 'instagram',
                                link: 'instagram.com'
                            }
                        ]
                    };
                }).catch((err) => {
                    console.log(err);
                });
        }).catch((err) => {
            console.log(err);
        });
    return data;
};

app.engine('hbs', exphbs({
    partialsDir: path.join(__dirname, '/views', '/partials'),
    layoutsDir: path.join(__dirname, '/views', '/layouts'),
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, '/public')));

get_data()
    .then((data) => {
        app.get('/', (req, res) => {
            data.last_updated = moment().format('MM/DD/YY hh:mm:ss');
            res.render('index', data);
        });
        app.listen(port, (err) => {
            console.log('Server Started');
        });
    }).catch((err) => {
        console.log(err);
    });
