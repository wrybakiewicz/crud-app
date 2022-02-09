import React from "react";

export class CreatePost extends React.Component {

    state = {content: ""};

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    render() {
        return <div>
            <h2>Create post</h2>
            <input type={"text"} value={this.state.content} onChange={(e) => this.setState({content: e.target.value})}/>
            <button onClick={() => this.createPost()}>Add</button>
        </div>
    }

    async createPost() {
        const content = this.state.content;
        const {crud} = this.props;
        const tx = await crud.create(content);
        const result = tx.wait();
    }

}