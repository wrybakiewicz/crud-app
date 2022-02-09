import React from "react";

export default class Post extends React.Component {

    state = {editing: false, newContent: ""};

    render() {
        const post = this.props.post;
        return <div>
            <div>Address: {post.createdBy}</div>
            <div>Content: {post.content}</div>
            <button onClick={() => this.setState({editing: true})} hidden={!this.isCreatedByCurrentAddress() || this.state.editing}>Update</button>
            <button onClick={() => this.delete()} hidden={!this.isCreatedByCurrentAddress()}>Delete</button>
            <input type={"text"} hidden={!this.state.editing} value={this.state.newContent} onChange={(e) => this.setState({newContent: e.target.value})}/>
            <button onClick={() => this.update()} hidden={!this.isCreatedByCurrentAddress() || !this.state.editing}>Update</button>
        </div>;
    }

    async delete() {
        const {crud} = this.props;
        const tx = await crud.deletePost(this.props.post.id);
        const result = tx.wait();
        this.props.refreshPosts();
    }

    async update() {
        const {crud} = this.props;
        const tx = await crud.update(this.props.post.id, this.state.newContent);
        const result = tx.wait();
        this.props.refreshPosts();
    }

    isCreatedByCurrentAddress(post) {
        return this.props.selectedAddress.toUpperCase() === this.props.post.createdBy.toUpperCase();
    }

}