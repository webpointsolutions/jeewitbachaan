import React, { Component } from 'react';
import './App.css';
import Navbar from '../components/layout/navbar/Navigation';
import Banner from '../components/layout/banner/Banner';
import FeaturedVideo from '../components/dashboard/FeaturedVideos';
import Footer from '../components/layout/footer/Footer';
import Watch from '../components/tabs/watch/Watch';
import Listen from '../components/tabs/listen/Listen';
import Read from '../components/tabs/read/Read';
import Modal from '../components/modal/modal';
import Popup from '../components/modal/popup';
import PopupVideo from '../components/modal/popupvideo';

class App extends Component {
  constructor() {
    super();
    this.state = {
      apiRequestParameter: {
        apiKey : "AIzaSyD_uxYFPitO2tfvRf9eIELBiBM7WluIyFo",
        maxResults : 12,
        order: 'date',
        type: 'video',
        part:'id',
        channelId: 'UCaZrvuy_4QsClMYRCcbyMjQ'
      },
      playlistData: [],
      videoData: [],
      route: 'home',
      modalTriggerKey: '',
      isModalOpen: false,
      showVideo: false
    }
  }

 
  componentDidMount () {
    // fetching latest videos from youtube api.
    const fullVideosUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${this.state.apiRequestParameter.channelId}&maxResults=${this.state.apiRequestParameter.maxResults}&order=${this.state.apiRequestParameter.order}&type=${this.state.apiRequestParameter.type}&key=${this.state.apiRequestParameter.apiKey}`;   
    console.log(fullVideosUrl);
    fetch(fullVideosUrl)
    .then(resp => resp.json())
    .then(data => this.setState({ playlistData: data.items }))
    .catch(err => console.log(err))
  }

  showVideo = (videoData) => {
    this.setState({showVideo: true, videoData: videoData})
  }

  onRouteChange = (route) => {
    if(route === 'watch') {
     return this.setState({ ...this.state, route: 'watch' })
    }if(route === 'listen') {
      return this.setState({ ...this.state, route: 'listen'})
    }if(route === 'read') {
      return this.setState({ ...this.state, route: 'read'})
    }
    else {
     return this.setState({ route: 'home'})
    }
  }

  toggleModal = (event) => {
    if (event === 'contact') {
      this.setState({ modalTriggerKey: 'contact'})
    }else if(event === 'video') {
      this.setState({ modalTriggerKey: 'video'})
    }else {
      this.setState({ modalTriggerKey: ''})
    }
    this.setState((prevState) => ({
     ...prevState, 
     isModalOpen: !prevState.isModalOpen}))
  }

  render() {
    const { route, playlistData, isModalOpen, apiRequestParameter, modalTriggerKey } = this.state;
    return (
      <div className="App">
        <Navbar onRouteChange={this.onRouteChange} toggleModal={this.toggleModal}/>
          {
            modalTriggerKey === 'contact' ?
            <div>
              <Modal>
                <Popup toggleModal={this.toggleModal} modalTriggerKey={modalTriggerKey}/>
              </Modal>
            </div> :
            modalTriggerKey === 'video' ?
            <div>
              <Modal>
                <PopupVideo toggleModal={this.toggleModal} modalTriggerKey={modalTriggerKey} videoData={this.state.videoData}/>
              </Modal>
            </div> : null

          }
        <Banner onRouteChange={this.onRouteChange}/>
        {
         route === 'home' ?
          <div>
            <FeaturedVideo playlistData={playlistData} 
              apiRequestParameter={apiRequestParameter} 
              showVideo={this.showVideo} 
              toggleModal={this.toggleModal}/>  
          </div> :
        route === 'watch' ?
          <div>
            <Watch onRouteChange={this.onRouteChange} toggleModal={this.toggleModal} isModalOpen={isModalOpen} showVideo={this.showVideo}/>
          </div> :
          route === 'listen' ?
          <div>
            <Listen onRouteChange={this.onRouteChange}/> 
          </div> :
          route === 'read' ?
          <div>
            <Read onRouteChange={this.onRouteChange}/>
          </div> : null
        }
      <Footer/>    
      </div>
    );
  }
}

export default App;
