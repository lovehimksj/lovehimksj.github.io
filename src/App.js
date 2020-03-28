import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import DataTable from "react-data-table-component";
const columns = [
	{
		name: 'STATE/UT',
		selector: 'state',
		sortable: true,
		minWidth: '0',
	},
	{
		name: 'C',
		selector: 'confirmed',
		cell: row => <div className='flex row'>
				<div  className={'text-infra-red delta-details delta-details_' + row.delta.confirmed}>{row.delta.confirmed}<span style={{width: '12px'}}><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="arrow-up" className="svg-inline--fa fa-arrow-up fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"/></svg></span></div>
				<div>{row.confirmed}</div>
			</div>,
		sortable: true,
		minWidth: '0'
	},
	{
		name: 'A',
		selector: 'active',
		sortable: true,
		minWidth: '0'
	},
	{
		name: 'R',
		selector: 'recovered',
		sortable: true,
		minWidth: '0'
	},
	{
		name: 'D',
		selector: 'deaths',
		sortable: true,
		minWidth: '0'
	},
];
class App extends Component {
	constructor() {
		super();
		this.state = {
			data: "",
			summary: {}
		};

		this.handleClick = this.handleClick.bind(this);
		this.setSummary = this.setSummary.bind(this);
		this.handleClick();
	}

	handleClick() {
		axios.get("https://api.covid19india.org/data.json").then(response => {
			this.setState({ data: response.data });
			this.setSummary();
		});
	}
	setSummary() {
		if (this.state.data) {
			const key_values = this.state.data.key_values[0];
			const listItems = this.state.data.statewise.find(
				number => number.state == "Total"
			);
			const summary = {};
			summary["confirmeddelta"] = "[+" + key_values.confirmeddelta + "]";
			summary["deceaseddelta"] = "[+" + key_values.deceaseddelta + "]";
			summary["recovereddelta"] = "[+" + key_values.recovereddelta + "]";
			summary["activedelta"] = "[+" + listItems.delta.active + "]";
			summary["active"] = listItems.active;
			summary["confirmed"] = listItems.confirmed;
			summary["deaths"] = listItems.deaths;
			summary["recovered"] = listItems.recovered;
			this.setState({ summary: summary });
		}
	}

	render() {
		const customStyles = {
			headCells: {
			  style: {
				paddingLeft: '0', // override the cell padding for head cells
				paddingRight: '0',
				justifyContent: 'center'
			  },
			},
			cells: {
			  style: {
				paddingLeft: '0', // override the cell padding for data cells
				paddingRight: '0',
				justifyContent: 'center'
			  },
			},
		  };
		if (!this.state.data.statewise && !this.state.data.summary) {
			return <div className="button__container"></div>;
		} else {
			const listItems = this.state.data.statewise
				.filter(number => number.state !== "Total" && number.active !== "0");
			listItems.push(this.state.data.statewise[0])
			return (
				<div>
					<TotalSummary key="0" total={this.state.summary} />
					<DataTable
						title= {listItems.length - 1 + " States/UTS Affected"}
						columns={columns}
						data={listItems}
						defaultSortField="title"
						fixedHeaderScrollHeight="300px"
						responsive
						customStyles={customStyles}
						expandableRows
						expandableRowsComponent={<ExpanableComponent />}
					/>
				</div>
			);
		}
	}
}

class TotalSummary extends Component {
	render() {
		const listItems = this.props.total;
		return (
			<div className="flex row content-space-even summary-pannel">
				<span className="flex column align-item-center text-light-yellow level-item col-4 infra-red">
					<p className="op-80 ">Confirmed</p>
					<DeltaPannel delta={listItems.confirmeddelta} />
					<SummaryPannel stats={listItems.confirmed} />
				</span>
				<span className="flex column align-item-center text-light-yellow light-sea-green level-item col-4">
					<p className="op-80">Active</p>
					<DeltaPannel delta={listItems.activedelta} />
					<SummaryPannel stats={listItems.active} />
				</span>
				<span className="flex column align-item-center text-light-yellow caribbean-green level-item col-4">
					<p className="op-80">Recovered</p>
					<DeltaPannel delta={listItems.recovereddelta} />
					<SummaryPannel stats={listItems.recovered} />
				</span>
				<span className="flex column align-item-center text-light-yellow sunglow level-item col-4">
					<p className="op-80">Deceased</p>
					<DeltaPannel delta={listItems.deceaseddelta} />
					<SummaryPannel stats={listItems.deaths} />
				</span>
			</div>
		);
	}
}

class SummaryPannel extends Component {
	render() {
		const test = this.props.stats;
		console.log(test);
		return (
			(<span className="level-item-detail">confirmed</span>), (<span>{test}</span>)
		);
	}
}

class DeltaPannel extends Component {
	render() {
		const deltaValue = this.props.delta;
		return <span className="op-80 level-item-title">{deltaValue}</span>;
	}
}

const ExpanableComponent = ({ data }) => <span>{data.delta.active}</span>;
export default App;
