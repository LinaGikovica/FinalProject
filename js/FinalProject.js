const NY_API_KEY = "3186dcf23ad0462d8acd49a8ed0f20ee";
const LP_API_KEY = "5a8c644554b944ee9e140045018eb3e4565bdc8bf13e7";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.handleDateChange = this.handleDateChange.bind(this);
  }

  handleDateChange(e) {
    // parse the YYYY-MM date from the Input
    // and convert it to real Date() object
    
    // ex. 2012-01
    // toDate() turns moment-internal time format to JS Date()
    const date = moment(e.target.value, "YYYY-MM").toDate();
    this.props.onSearchDateChange(date);
  }

  render() {

    //  convert Date() to format input understands
    const date = this.props.searchDate;
    const dateString = moment(date).format("YYYY-MM");

    return (
      <form>
        <input 
          type="month"
          value={dateString}
          onChange={this.handleDateChange}/>
        <button>Search</button>
      </form>
    );
  }
}

class ResultItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = { }
  }

  componentDidMount() {
    const component = this;
    const url = `http://api.linkpreview.net/?key=${LP_API_KEY}&q=${this.props.url}`

    jQuery.get(url, data => component.setState(data));
  }

  render() {
    let image = null;
    if(this.state.image != null) {
      image = <a href={this.props.url} target="_blank"><img src={this.state.image}/></a>
    }
    else {
      image = <a href={this.props.url} target="_blank"><img src="http://via.placeholder.com/350x150"/></a>
    }
    return (
      <div>
        <h2>{this.props.title}</h2>
        {image}
        <p>{this.props.description}</p>
      </div>
    );
  }
}

class ResultTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      articles: []
    };
  }

  // poziva se kada se komponenta zakaci na DOM
  componentDidMount() {
    const component = this;
    const date = this.props.date;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const url = `http://api.nytimes.com/svc/archive/v1/${year}/${month}.json?api-key=${NY_API_KEY}`

    jQuery.get(url, data => {
      component.setState({
        articles: data.response.docs.slice(0, 20)
      });
    });
  }

  render() {
    const date = this.props.date;
    const items = [];
    const articles = this.state.articles;
    articles.forEach(article => {
        items.push(
          <ResultItem
            key={article._id}
            url={article.web_url}
            title={article.headline.main}
            description={article.abstract}/>
        );
    });

    return items;
  }

  getArticles(year, month) {
    var response = $.ajax()
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleDateChange = this.handleDateChange.bind(this);

    this.state = {
      searchDate: new Date("2003-01-01")
    };
  }

  handleDateChange(date) {
    this.setState({
      searchDate: date
    });
  }

  render() {
    return (
      <div className="App">
        <SearchBar 
          searchDate={this.state.searchDate}
          onSearchDateChange={this.handleDateChange}/>
        {/* force key to be unique to force ResultTable to reload data.
            Forsira pozivanje componentDidMount jer re-kreira komponentu. */}        
        <ResultTable 
          key={this.state.searchDate}
          date={this.state.searchDate}/>
      </div>
    );
  }
}

        ReactDOM.render(<App />, document.getElementById('root'));


