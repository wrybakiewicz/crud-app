import React from "react";
import Post from "./Post";

export class AllPosts extends React.Component {

    state = {posts: []};

    componentDidMount() {
        this.getAllPosts();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.refreshPosts || this.state.refreshPosts) {
            this.getAllPosts();
        }
    }

    render() {
        return <div>
            <h2>All posts:</h2>
            {this.state.posts.map((post, index) => <Post post={post} key={index} selectedAddress={this.props.selectedAddress} crud={this.props.crud} refreshPosts={() => this.setState({refreshPosts: true})}/>)}
        </div>
    }

    async getAllPosts() {
        const {crud} = this.props;
        const allPosts = await crud.getAllPosts();
        this.setState({posts: allPosts});
    }

}