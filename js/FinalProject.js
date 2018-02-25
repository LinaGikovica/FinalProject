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
    <div className="Search">
    <p> Choose a month and a year between January 1851 and current date to get selected New York Times articles from that period. Click on image will get you to arcicle page  or digitalised version if it exist, while click on the headline will give you json details. </p>
      <form className="Form">
        <input id="mon"
          type="month"
          value={dateString}
          onChange={this.handleDateChange}/>
      </form>
    </div>
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
    const url = `https://api.linkpreview.net/?key=${LP_API_KEY}&q=${this.props.url}`

    jQuery.get(url, data => component.setState(data));
  }

  render() {
    let image = null;
    if(this.state.image != null) {
      image = <a href={this.props.url} target="_blank"><img className="articleImage" src={this.state.image}/></a>
    }
    else {
      image = <a href={this.props.url} target="_blank"><img className="articleImage" src="https://i.imgur.com/UFwbr6k.jpg"/></a>
    }
    return (
      <div className="Item">
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
    const url = `https://api.nytimes.com/svc/archive/v1/${year}/${month}.json?api-key=${NY_API_KEY}`

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
      searchDate: new Date
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
        <div className="Result">
        <ResultTable
          key={this.state.searchDate}
          date={this.state.searchDate}/>
        </div>
      </div>
    );
  }
}

        ReactDOM.render(<App />, document.getElementById('root'));


