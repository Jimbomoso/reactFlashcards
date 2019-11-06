import React, { Component } from 'react';
import './App.css';
import Card from './card/Card';
import DrawButton from './drawButton/DrawButton';
import firebase from 'firebase/app';
import 'firebase/database';

import { DB_CONFIG } from './config/firebase/db_config';

class App extends Component {
  constructor(props) {
    super(props);

    this.app = firebase.initializeApp(DB_CONFIG);
    this.database = this.app.database().ref().child('cards');
    this.updateCard = this.updateCard.bind(this);

    this.state = {
      cards: [],
      currentCard: {}
    }
  }

  UNSAFE_componentWillMount() {
    console.log(this.app.database().ref().child('cards'))
    const currentCards = this.state.cards;
    this.database.on('child_added', snap => {
      currentCards.push({
        id: snap.val().id,
        question: snap.val().question,
        answer: snap.val().answer
      })

      this.setState({
        cards: currentCards,
        currentCard: this.getRandomCard(currentCards)
      })
    })
  }

  getRandomCard(currentCards) {
    let card = currentCards[Math.floor(Math.random() * currentCards.length)];
    return (card);
  }

  updateCard() {
    const currentCards = this.state.cards
    this.setState({
      currentCard: this.getRandomCard(currentCards)
    })
  }

  render() {
    return (
      <div className="App">
        <div className="cardRow">
          <Card question={this.state.currentCard.question}
            answer={this.state.currentCard.answer}
          />
        </div>
        <div className="buttonRow">
          <DrawButton drawCard={this.updateCard} />
        </div>



      </div>
    );
  }
}

export default App;
