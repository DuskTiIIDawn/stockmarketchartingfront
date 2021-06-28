import React, { Component } from 'react';
import axios from 'axios';

export default class Home extends Component {
    state = {
        ipo: null
    }

    componentDidMount() {

    }

    render() {
        return (
            <div class="card container text-center">
                <span class="my">Stock Market Charting App</span>
            </div>
        )
    }
}

