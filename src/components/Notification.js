import React, { Component } from 'react';


class Notification extends Component {
	render() {
        const { text, position } = this.props;

		return (
			<div className="notification">
                {text}
			</div>
		);
	}
}


export default Notification;
