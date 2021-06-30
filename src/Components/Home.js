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
            <div class="card  col-md-7  mx-auto text-center">
                <span class="my">Stock Market Charting</span>
            </div>
        )
    }
}

