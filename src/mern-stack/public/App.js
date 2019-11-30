"use strict";

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) {
    return new Date(value);
  } else {
    return value;
  }
}

class IssueFilter extends React.Component {
  render() {
    return React.createElement("div", null, "This is a place holder for the issue filter.");
  }

}

function IssueRow(props) {
  const issue = props.issue;
  return React.createElement("tr", null, React.createElement("td", null, issue.id), React.createElement("td", null, issue.status), React.createElement("td", null, issue.owner), React.createElement("td", null, issue.created.toISOString().slice(0, 10)), React.createElement("td", null, issue.effort), React.createElement("td", null, issue.due ? issue.due.toISOString().slice(0, 10) : ''), React.createElement("td", null, issue.title));
}

function IssueTable(props) {
  const issueRows = props.issues.map(issue => React.createElement(IssueRow, {
    key: issue.id,
    issue: issue
  }));
  return React.createElement("table", {
    className: "bordered-table"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "ID"), React.createElement("th", null, "Status"), React.createElement("th", null, "Owner"), React.createElement("th", null, "Created"), React.createElement("th", null, "Effort"), React.createElement("th", null, "Due Date"), React.createElement("th", null, "Title"))), React.createElement("tbody", null, issueRows));
}

class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.issueAdd;
    const issue = {
      owner: form.owner.value,
      title: form.title.value,
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10) //Due Date = 10 days from current date

    };
    this.props.createIssue(issue);
    form.owner.value = "";
    form.title.value = "";
  }

  render() {
    return React.createElement("form", {
      name: "issueAdd",
      onSubmit: this.handleSubmit
    }, React.createElement("input", {
      type: "text",
      name: "owner",
      placeholder: "Owner"
    }), React.createElement("input", {
      type: "text",
      name: "title",
      placeholder: "Title"
    }), React.createElement("button", null, "Add"));
  }

}

class IssueList extends React.Component {
  constructor() {
    super();
    this.state = {
      issues: []
    };
    this.createIssue = this.createIssue.bind(this); //to make sure, when a copy of createIssue invoke, then the lexical scope bound to IssueList
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    //Change memory variable initialIssues to fetch from api
    const query = `query {
            issueList{
                id title status owner created effort due
            }
        }`;
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    }); //const result = await response.json();

    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);
    this.setState({
      issues: result.data.issueList
    });
  }

  async createIssue(issue) {
    // const query = `mutation{
    //     issueAdd(issue:{
    //         title:"${issue.title}",
    //         owner:"${issue.owner}",
    //         due:"${issue.due.toISOString()}",
    //     }){
    //         id
    //     }
    // }`;
    const query = `mutation issueAdd($issue:IssueInputs!){
            issueAdd(issue:$issue){
                id
            }
        }`;
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: {
          issue
        }
      })
    });
    this.loadData();
  }

  render() {
    return React.createElement(React.Fragment, null, React.createElement("h1", null, "Issue Tracker"), React.createElement(IssueFilter, null), React.createElement("hr", null), React.createElement(IssueTable, {
      issues: this.state.issues
    }), React.createElement("hr", null), React.createElement(IssueAdd, {
      createIssue: this.createIssue
    }));
  }

}

const element = React.createElement(IssueList, null);
ReactDOM.render(element, document.getElementById('content'));