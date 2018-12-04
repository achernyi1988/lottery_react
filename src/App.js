import React, {Component} from 'react';
import './App.css';
import web3 from "./web3";
import lottery from "./lottery"


export default class App extends Component {

    //state = { manager:""};ES6

    constructor(props){
        super(props);
        this.state =  {
            manager : "",
            winner:   "???",
            players: [] ,
            balance: "",
            value:"",
            message: ""};

    }
    onEnter = async (event) =>{
        event.preventDefault();
        this.setState({winner: "???"});
        const accounts = await web3.eth.getAccounts();

        this.setState({message: "waiting on transaction success ..."});

        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei(this.state.value, 'ether')
        });
        await this.updateStates();
        this.setState({message: "You have been entered!"});

    };

    onPickWinner = async () => {
        const accounts = await web3.eth.getAccounts();
        this.setState({message: "waiting on transaction success ..."});

        await lottery.methods.pickWinner().send({
            from: accounts[0]});

        await this.updateStates();
        this.setState({message: "The winner has been picked!"});

    };

     async componentDidMount(){
         await this.updateStates();
    }

    updateStates = async() => {
        const manager = await lottery.methods.manager().call();
        const winner = await lottery.methods.winner().call();
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);
        this.setState({manager, winner, players, balance});
    }

  render() {
      return (
    <div>
        <h2> Lottery Contract </h2>
        <p>  This contract is managed by {this.state.manager}
        <br></br> There are currently {this.state.players.length} people entered
            competing to win {web3.utils.fromWei(this.state.balance, "ether")} ether!
            <br></br> players = { this.state.players.map(function(player){ return ( <p>  {player} </p>); })}
        </p>
        <hr/>
        <form onSubmit={this.onEnter}>
            <h4> Want to try your like?</h4>
            <div>
                <label>Amount of ether to enter</label>
                <input
                    value = {this.state.value}
                    onChange = {event => this.setState({value: event.target.value})}
                />
            </div>
            <button>Enter</button>
        </form>
        <hr    />
        <h4>Ready to pick a winner</h4>
        <button onClick = {this.onPickWinner} > Pick a winner</button>
        <hr/>

        <h1> {this.state.message}</h1>

        <h4>The winner is {this.state.winner}</h4>
        <hr/>
    </div>
    );
  }
}

