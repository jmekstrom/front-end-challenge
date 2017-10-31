import React, { Component } from 'react'
import sr from './assets/js/scrollreveal.js'
import './assets/css/style.min.css'
import api from './api'


//Car Card class component
class Car_Card extends Component {

  //set initial state, controls css class that styles likestatus of card
  state = {
    likeStatus : this.props.likeStatusClass
  }

  //function the invokes the likeStatusRecord method that lives in the board class 
  //keeps record of likestatuses and updates local state
  selectStatus = (status,key) =>{
      this.props.likeStatusRecord(status,key);
      this.setState(prevState => ({
        likeStatus: status
      }));
  };

  //scroll reveal setup
  componentDidMount = () => {
    const config = {
      origin: 'right',
      duration: 1000,
      delay: 150,
      distance: '500px',
      scale: .5,
      easing: 'cubic-bezier(0.6, 0.4, 0.2, 1.5)',
      rotate: { x: 0, y: 0, z: 50 },
      viewFactor: 0.2,
    }

    sr.reveal(this.refs.carReveal, config)
  }


  render() {

    //formatting api data to display correctly, handling missing data and string formats
    //added bonus - it makes the template easier to read
    const cardID = this.props.cardID;
    const availability = "For Sale";
    const imageUrl = this.props.imageUrl || "http://placehold.it/400x300";
    const year = this.props.year || "";
    const make = this.props.make || "";
    const model = this.props.model || "";
    const horsePower = this.props.horsePower ? this.props.horsePower + "-hp," : "";
    const engineType = this.props.engineType || "";
    const driveType = this.props.driveType ? this.props.driveType + " Drive" : "";
    const combinedMpg = this.props.combinedMpg === null ? "∞ Combined MPG" : (this.props.combinedMpg !== "" ? this.props.combinedMpg + " Combined MPG":"");
    const price = this.props.price ? (this.props.price).toLocaleString('en',{
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }) : "Coming Soon";
    const engineVolume = this.props.engineVolume ? (this.props.engineVolume).toLocaleString('en',{
       minimumSignificantDigits: 2
    }) + "-liter" : "";
    

    return (
      <div className={"col-lg-4 col-md-6 col-xs-6 car-card "+this.state.likeStatus} ref='carReveal'>
        <div className="d-block h-100 img-thumbnail">
          <img className="img-fluid" src={imageUrl} alt={year + make + model}></img>
          <div className="d-flex details">
            <div className="col-7 left det-col">
              <h6>{year} {make} {model}</h6>
              <div>{horsePower} {engineVolume} {engineType}</div>
              <div>{driveType}</div>
            </div>
            <div className="col-5 right det-col">
              <h5>{price}</h5>
              <div className="availability">{availability}</div>
              <div className="MPG">{combinedMpg}</div>
            </div>
          </div>
          <div className="like-status">
            <span className="like">
              <img src="icons/ic_favorite_border.svg" className="liked-icon" onClick={() => this.selectStatus("liked",cardID)}></img>
              <img src="icons/ic_favorite_active.svg" className="liked-icon-active" onClick={() => this.selectStatus("",cardID)}></img>
            </span>
            <span className="dislike">
              <img src="icons/ic_hide_border.svg" className="disliked-icon" onClick={() => this.selectStatus("disliked",cardID)}></img>
              <img src="icons/ic_hide_active.svg" className="disliked-icon-active" onClick={() => this.selectStatus("",cardID)}></img>
            </span>
          </div>
        </div>
      </div>
    );
  };
};//end Car_Card Class


//List function component
const Car_CardList = (props) => {

  return (

    <div className="row text-center text-lg-left car-cards">
      {props.cards.map((card,index) => {
        if(card.likeStatus === props.likeFilter || props.likeFilter === 0){
          return(
            <Car_Card key={index} cardID={index} likeStatusRecord={props.likeStatusRecord} likeStatusClass={card.likeStatusClass} {...card} />
          )
        }
      })}
    </div>

  )
};//end Car_CardList function


//Top Level before mount point
class Car_CardBoard extends Component {

  constructor(props){
    super(props);
    this.state = {
      cars: [],
      likeFilter: 0,
    }
    this.handleChange = this.handleChange.bind(this);
  }

  //function called when the car filter is changed
  handleChange = (event) => {
    let tempVal = event.target.value;
    if(tempVal === "liked"){
      tempVal = 1;
    }
    else if (tempVal === "disliked"){
      tempVal = -1;
    }
    else{
      tempVal = 0;
    }
    this.setState({likeFilter: tempVal})
  }

  //updates the cars state with likestatus of individual cars
  likeStatusRecord = (status,key) => {
    const tempCars = this.state.cars;
    tempCars[key].likeStatusClass = status;
    if(status === "liked"){
      tempCars[key].likeStatus = 1;
    }
    else if (status === "disliked"){
      tempCars[key].likeStatus = -1
    }
    else{
      tempCars[key].likeStatus = 0
    }
    this.setState(prevState => ({
        cars: tempCars
    }));
    //console.log(tempCars)
  }


  //get api feed and update state with response
  componentWillMount(){
    api.getStuffs().then((res) => {
      for(var i in res.data){
        res.data[i].likeStatus = 0
      }
      this.setState({
        cars: res.data
      })
    })
  }

  render() {
    //console.log(this.state.cars)
    return (

      <div className="container car-board">
      <h1 className="cars-title text-left">Sports Cars</h1>
        <div className="flexcontainer">
          <form className="form-inline">
            <label className="mr-sm-2 sr-only" htmlFor="inlineFormCustomSelect">Like/Dislike Filter</label>
              <select className="custom-select like-filter mb-2 mr-sm-2 mb-sm-0" id="inlineFormCustomSelect" onChange={this.handleChange}>
                <option defaultValue value="all">All Cars</option>
                <option value="liked">Liked Cars</option>
                <option value="disliked">Disliked Cars</option>
              </select>
            {/*<label className="sr-only" htmlFor="searchInput">Name</label>
            <input type="text" className="form-control mb-2 mb-sm-0" id="seachInput" placeholder="Search"></input>*/}
          </form>
        </div>
        <Car_CardList cards={this.state.cars} likeFilter={this.state.likeFilter} likeStatusRecord={this.likeStatusRecord} />
      </div>

    )//end return
  }
};//end Car_CardBoard class


class App extends Component {

  render (){
    return(
      <div className="App">
        <Car_CardBoard  />
      </div>
    )
  }
};//end App class

export default App
