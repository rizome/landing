import React, { Component } from 'react'

import { Loading, LoadingError } from './Loading'
import { loadTechPosts, loadBusinessPosts, states } from '../services/api'
import { ago, isNewer, TIME_UNITS } from '../services/dates'

const TECH = 'tech'
const BUSINESS = 'business'

class Posts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            state: states.LOADING,
            posts: []
        }
    }

    componentWillMount() {
        const loader = this.props.kind == TECH ? loadTechPosts : loadBusinessPosts
        loader()
            .then(posts => this.setState({ state: states.LOADED, posts }))
            .catch(err => {
                console.error(err)
                this.setState({ state: states.ERROR })
            })
    }

    render() {
        const { state, posts } = this.state
        if (state === states.LOADING) {
            return <Loading />
        } else if (state === states.ERROR) {
            return <LoadingError />
        }

        return (
            <div className='posts'>
                {posts.map((p, i) => <Post key={i} first={i === 0} post={p} />)}
            </div>
        )
    }
}

export function TechPosts(props) {
    return <Posts kind={TECH} />
}

export function BusinessPosts(props) {
    return <Posts kind={BUSINESS} />
}

function Post({ post, first }) {
    return (
        <div className={'post' + (first && isNewer(post.date, 2 * TIME_UNITS['week']) ? ' new' : '')}>
            <a href={post.link}>{post.title}</a>
            {first ? (
                <span className='timeAgo'>Published {ago(post.date)} ago</span>
            ) : null}
        </div>
    )
}
