import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients, // All tasks start in backlog
        inProgress: [],
        complete: [],
      }
    }
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    }
    this.dragula = null;
  }
  getClients() {
    return [
      //ensuring all cards are in backlog
      ['1','Stark, White and Abbott','Cloned Optimal Architecture','backlog' ],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'backlog'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'backlog'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'backlog'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'backlog'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'backlog'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'backlog'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'backlog'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'backlog'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }
  componentDidMount() {
    this.initDragula();
  }

  componentWillUnmount() {
    if (this.dragula) {
      this.dragula.destroy();
    }
  }

  initDragula() {
    const containers = [
      this.swimlanes.backlog.current,
      this.swimlanes.inProgress.current,
      this.swimlanes.complete.current,
    ];
    this.dragula = Dragula(containers, {
      revertOnSpill: true,
    });
    this.dragula.on('drop', (el, target, source, sibling) => {
      // Cancel Dragula's DOM move, React will handle it
      this.dragula.cancel(true);
      const cardId = el.getAttribute('data-id');
      const targetLane = this.getLaneNameByRef(target);
      const sourceLane = this.getLaneNameByRef(source);
      if (!cardId || !targetLane || !sourceLane) return;
      // Remove from source
      let card = null;
      const newSource = this.state.clients[sourceLane].filter(c => {
        if (c.id === cardId) {
          card = { ...c, status: this.laneStatus(targetLane) };
          return false;
        }
        return true;
      });
      // Insert into target at correct position
      let newTarget = [...this.state.clients[targetLane]];
      let idx = 0;
      if (sibling) {
        const siblingId = sibling.getAttribute('data-id');
        idx = newTarget.findIndex(c => c.id === siblingId);
        if (idx === -1) idx = newTarget.length;
      } else {
        idx = newTarget.length;
      }
      newTarget.splice(idx, 0, card);
      // Build new state
      this.setState({
        clients: {
          ...this.state.clients,
          [sourceLane]: newSource,
          [targetLane]: newTarget,
        }
      });
    });
  }

  getLaneNameByRef(ref) {
    if (ref === this.swimlanes.backlog.current) return 'backlog';
    if (ref === this.swimlanes.inProgress.current) return 'inProgress';
    if (ref === this.swimlanes.complete.current) return 'complete';
    return null;
  }

  laneStatus(lane) {
    if (lane === 'backlog') return 'backlog';
    if (lane === 'inProgress') return 'in-progress';
    if (lane === 'complete') return 'complete';
    return 'backlog';
  }

  renderSwimlane(name, clients, ref) {
    return (
      <Swimlane name={name} clients={clients} dragulaRef={ref}/>
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid" ref={this.swimlanes.dragulaRef}>
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', this.state.clients.backlog, this.swimlanes.backlog)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', this.state.clients.inProgress, this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', this.state.clients.complete, this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
