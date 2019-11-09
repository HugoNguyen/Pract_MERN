
class HelloWorld extends React.Component{
    render(){
        const continents = ['Africa','America','Asia','Australia','Europe'];
        const helloContinents = Array.from(continents,c=>`Hello ${c}!`);
        const message = helloContinents.join(' ');

        return (
            <div title="Outer div">
                <h1 className='class_h1'>{message}</h1>
            </div>
        );
    }
}

class IssueFilter extends React.Component {
    render(){
        return(
            <div>This is a place holder for the issue filter.</div>
        );
    }
}

class IssueTable extends React.Component {
    render(){
        return(
            <div>This is a place holder for a table of issues.</div>
        );
    }
}

class IssueAdd extends React.Component {
    render(){
        return(
            <div>This is a place holder for a form to add an issue.</div>
        );
    }
}

class IssueList extends React.Component {
    render(){
        return(
            <React.Fragment>
                <h1>Issue Tracker</h1>
                <IssueFilter/>
                <hr/>
                <IssueTable/>
                <hr/>
                <IssueAdd/>
            </React.Fragment>
        );
    }
}

const element = <IssueList/>;

ReactDOM.render(element,document.getElementById('content'));