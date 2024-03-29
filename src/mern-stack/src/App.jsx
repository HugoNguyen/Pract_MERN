const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key,value){
    if(dateRegex.test(value)){
        return new Date(value);
    }
    else{
        return value;
    }
}

/**
 * variables = {} -> ES2015, default function parameter
 **/
async function graphQLFetch(query, variables = {}){
    try{
        const response = await fetch('/graphql',{
            method: 'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({query,variables})
        });

        const body = await response.text();
        const result = JSON.parse(body,jsonDateReviver);

        if(result.errors){
            const error = result.errors[0];
            if(error.extensions.code == 'BAD_USER_INPUT'){
                const details = error.extensions.exception.errors.join('\n');
                alert(`${error.message}:\n ${details}`);
            }else{
                alert(`${error.extensions.code}: ${error.message}`);
            }
        }

        return result.data;
    }
    catch(e){
        alert(`Error in sending data to server: ${e.message}`);
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
            owner: form.owner.value, title: form.title.value,
            due: new Date(new Date().getTime()+1000*60*60*24*10) //Due Date = 10 days from current date
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

        // const response = await fetch('/graphql',{
        //     method: 'POST',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify({query})
        // })
        // const body = await response.text();
        // const result = JSON.parse(body,jsonDateReviver);
        // this.setState({issues:result.data.issueList});

        const data = await graphQLFetch(query);
        if(data){
            this.setState({issues:data.issueList});
        }
    }

    async createIssue(issue){
        const query = `mutation issueAdd($issue:IssueInputs!){
            issueAdd(issue:$issue){
                id
            }
        }`;

        // const response = await fetch('/graphql',{
        //     method:'POST',
        //     headers:{'Content-Type':'application/json'},
        //     body: JSON.stringify({query ,variables:{issue}})
        // });
        // this.loadData();

        const data = await graphQLFetch(query,{issue});
        if(data){
            this.loadData();
        }
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