const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key,value){
    if(dateRegex.test(value)){
        return new Date(value);
    }
    else{
        return value;
    }
}

class IssueFilter extends React.Component {
    render(){
        return(
            <div>This is a place holder for the issue filter.</div>
        );
    }
}

function IssueRow(props){
    const issue = props.issue;
    return(
        <tr>
            <td>{issue.id}</td>
            <td>{issue.status}</td>
            <td>{issue.owner}</td>
            <td>{issue.created.toISOString().slice(0, 10)}</td>
            <td>{issue.effort}</td>
            <td>{issue.due? issue.due.toISOString().slice(0, 10):''}</td>
            <td>{issue.title}</td>
        </tr>
    );
}

function IssueTable(props){
    const issueRows = props.issues.map(issue=><IssueRow key={issue.id} issue={issue}/>);
        
    return(
        <table className="bordered-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>Created</th>
                    <th>Effort</th>
                    <th>Due Date</th>
                    <th>Title</th>
                </tr>
            </thead>
            <tbody>
                {issueRows}
            </tbody>
        </table>
    );
}

class IssueAdd extends React.Component {

    constructor(){
        super();

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e){
        e.preventDefault();
        const form = document.forms.issueAdd;
        const issue = {
            owner: form.owner.value, title: form.title.value, status: 'New'
        }
        this.props.createIssue(issue);
        form.owner.value = "";
        form.title.value = "";
    }

    render(){
        return(
            <form name="issueAdd" onSubmit={this.handleSubmit}>
                <input type="text" name="owner" placeholder="Owner" />
                <input type="text" name="title" placeholder="Title" />
                <button>Add</button>
            </form>
        );
    }
}

class IssueList extends React.Component {

    constructor(){
        super();
        this.state = {issues:[]};

        this.createIssue = this.createIssue.bind(this); //to make sure, when a copy of createIssue invoke, then the lexical scope bound to IssueList
    }

    componentDidMount(){
        this.loadData();
    }

    async loadData(){

        //Change memory variable initialIssues to fetch from api
        const query = `query {
            issueList{
                id title status owner created effort due
            }
        }`;

        const response = await fetch('/graphql',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({query})
        })

        //const result = await response.json();
        const body = await response.text();
        const result = JSON.parse(body,jsonDateReviver);
        this.setState({issues:result.data.issueList});
    }

    createIssue(issue){
        issue.id = this.state.issues.length + 1;
        issue.created = new Date();

        const newIssueList = this.state.issues.slice();
        newIssueList.push(issue);
        this.setState({issues:newIssueList});
    }

    render(){
        return(
            <React.Fragment>
                <h1>Issue Tracker</h1>
                <IssueFilter/>
                <hr/>
                <IssueTable issues={this.state.issues} />
                <hr/>
                <IssueAdd createIssue={this.createIssue} />
            </React.Fragment>
        );
    }
}

const element = <IssueList/>;

ReactDOM.render(element,document.getElementById('content'));