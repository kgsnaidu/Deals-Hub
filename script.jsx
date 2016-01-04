// Code goes here
var OfferCards = React.createClass({
  getInitialState : function()
  {
    return {};
  },
  render : function() {
    var products=this.props.deals, likes=this.props.likes,likeCount=this.props.likeCount, i=0, productCards=[];

      productCards = products.map(function(item){
      i++;
      var brand = "fa fa-"+(item.provider).toLowerCase();
      var discount = item.actual_price*(Number((item.discount).substring(0,item.discount.length-1)))/100;
      var final_price = Math.round(item.actual_price-discount);
      return (
        <div className="col-xs-12 col-sm-12 col-md-4">
          <div className="panel panel-default">
            <div className='panel-heading'>
              <div className='discount'><b>{item.discount}</b> <small>Off</small></div>
              <img src={item.image} className='product-image image-responsive ' />
            </div>
            <div className="panel-body">
              <h4 className='text-default'>{item.name}</h4>
              <Rating rating={item.rating} /> {item.rating} <button className='btn btn-default btn-xs pull-right' onClick={likeCount.bind(null, item.id)}>{likes[item.id]} <span className='fa fa-thumbs-up'></span></button>
              <h4>
              <i className='fa fa-tag'></i> <span className='text-success'><b>₹ {final_price}</b></span>
              &emsp;<small><span className='text-danger actual-price'>₹ {item.actual_price}</span></small>
              </h4>
              <small><i className='fa fa-user'></i><span> Provider: {item.provider}</span> <i className={brand}></i></small>
              <br />
              <br />
              <a href={item.link} target="_blank" className='btn btn-success btn-sm col-xs-12 grab-deal'>GRAB DEAL</a>
            </div>
          </div>
        </div>
        );
    });
    return (
      <div className='row col-md-12 col-sm-24'>
      {productCards}
      </div>

      );
  }
});

var Rating = React.createClass({

  render: function() {
    var rating=Math.round(this.props.rating), stars=[];
    for(var i=1;i<=5;i++)
    {
      if(i<=rating)
      {
        stars.push(<span className='fa fa-star'></span>)
      }
      else
      {
        stars.push(<span className='fa fa-star-o'></span>)
      }
    }
    return (
      <span className='rating'>
        {stars}
      </span>
      );
  }
});

var NavBar = React.createClass({
  getInitialState : function(){
    return {
      api_hits:0
    };
  },

  componentDidMount: function() {

    $.get("http://nutanix.0x10.info/api/deals?type=json&query=api_hits", (function(data){
      data = JSON.parse(data);
      this.setState({api_hits:data.api_hits});
    }).bind(this));

  },

  render : function () {

    var likes = [0], api_hits=this.state.api_hits;
    if(this.props.likes){
      likes=this.props.likes;
    }
    var totalLikes = likes.reduce(function(a,b){
    return a+b;
    });

    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                </button>
          </div>
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav">
                <li className='headerText'><h4><b>DealsHub</b></h4></li>
              </ul>
              <ul className="nav navbar-nav pull-right">
                <li className='headerText'><h4>Total Likes: <span className=""><b>{totalLikes}</b></span></h4></li>
                <li className='divider'>&emsp;&emsp;&emsp;</li>
                <li className='headerText'><h4>API Hits: <span className=""><b>{api_hits}</b></span></h4></li>
              </ul>
          </div>
        </div>
      </nav>


      );
  }
});

var Main = React.createClass({
  getInitialState : function(){
    return {
      deals:[]
    };
  },
  setLocalData : function (data) {
    data = JSON.parse(data);
    var likes, i=0;

    var deals = data.deals.map(function(item){
      item.id=i;
      i++;
      return item;
    });

    if(typeof(Storage) !== "undefined")
    {
      if(localStorage.dealLikes)
      {
        likes = JSON.parse(localStorage.dealLikes);
      }
      else
      {
        likes = data.deals.map(function(item){
          return 0;
        });
        localStorage.dealLikes = JSON.stringify(likes);
      }
    }
    else
    {
       this.setState({deals:deals});
       alert("Local Storage Not Supported!")
    }

    this.setState({deals:deals, likes:likes});
  },
  componentDidMount: function() {

    $.get("./deals.txt", (function(data){
      this.setLocalData(data);
    }).bind(this));

  },
  likeCount: function(id){
    var dealLikes = this.state.likes;
    dealLikes[id]+=1;
    localStorage.dealLikes = JSON.stringify(dealLikes);
    this.setState({likes:JSON.parse(localStorage.dealLikes)});
  },
  render : function() {
    var deals=this.state.deals, likes=this.state.likes;
    return (
      <div>
        <NavBar likes={likes} />
        <br />
        <br />
        <br />
        <br />
        <div className='container'>
            <OfferCards deals={deals} likes={likes} likeCount={this.likeCount} />
        </div>
      </div>
      );
  }
});

React.render(<Main />, document.getElementById('content'));
