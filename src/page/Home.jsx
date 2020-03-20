import React, { Component } from "react";
import style from "./home.less";
import { Button } from "antd-mobile";

class Home extends Component {
	constructor (props) {
		super(props);
		this.state = {
			name: "首页"
		};

	}

	componentDidMount () {
		console.log(1);
	}

	log(){
		console.log(this)
		console.log('asdasdsada')
	}

	render () {
		return (
			<div className={style.page}>
				<p className={style.p2} onClick={() => this.log()}>杜鹃</p>
				<div className='title'>标题</div>
				{
					this.state.name
				}
				<img className={style.imgKu} alt='' src={require("../images/webp.jpg")}/>
				<Button> 按钮</Button>
			</div>
		);
	}
}

export default Home;
