import React, { Component, createRef } from "react";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import classes from "./NoteList.module.css";

import {
  addNote,
  changeNote,
  fetchNotes,
  removeNote,
  saveNotes,
  setFilter,
} from "../../store/notes/actions";
import { connect } from "react-redux";
import Loader from "../../components/UI/Loader/Loader";
import { ApplicationState } from "../../store";
import { INote } from "../../store/notes/reducers";
import { isEqual } from "../../lib/isEqual";

interface State {
  newNoteText: string;
}

interface OwnProps {
  textColor: string;
}

interface DispatchProps {
  fetchNotes: () => void;
  saveNotes: () => void;
  changeNote: (id: string) => void;
  addNote: (note: INote) => void;
  setFilter: (filter: string) => void;
  removeNote: (id: string) => void;
}

interface StateProps {
  notes: Array<INote>;
  updatedNotes: Array<INote>;
  loading: boolean;
  message: string;
  filter: string;
}

type Props = StateProps & DispatchProps & OwnProps;

function mapStateToProps(state: ApplicationState): StateProps {
  return {
    notes: state.note.notes,
    updatedNotes: state.note.updatedNotes,
    loading: state.note.loading,
    message: state.note.message,
    filter: state.note.filter,
  };
}

function mapDispatchToProps(
  dispatch: ThunkDispatch<ApplicationState, {}, AnyAction>
): DispatchProps {
  return {
    fetchNotes: () => dispatch(fetchNotes()),
    saveNotes: () => dispatch(saveNotes()),
    changeNote: (id: string) => dispatch(changeNote(id)),
    addNote: (note: INote) => dispatch(addNote(note)),
    setFilter: (filter: string) => dispatch(setFilter(filter)),
    removeNote: (id: string) => dispatch(removeNote(id)),
  };
}

class NoteList extends Component<Props, State> {
  constructor(prop: Props) {
    super(prop);
    this.state = {
      newNoteText: "",
    };
  }

  componentDidMount() {
    this.props.fetchNotes();
  }

  renderNotes() {
    return this.props.updatedNotes
      .filter((value) => {
        if (this.props.filter === "completed") {
          return value.done;
        } else if (this.props.filter === "waiting") {
          return !value.done;
        } else if (this.props.filter === "all") return true;
      })
      .map((note, index) => {
        return (
          <tr key={note.id}>
            <td>{note.text}</td>
            <td>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckChecked"
                  checked={!note.done}
                  onChange={() => this.props.changeNote(note.id)}
                />
                <label className="form-check-label" htmlFor="flexCheckChecked">
                  {note.done ? "completed" : "waiting"}
                </label>
              </div>
            </td>
            <td>
              <button
                type="button"
                className="btn btn-outline-info"
                onClick={() => this.props.removeNote(note.id)}
              >
                Remove
              </button>
            </td>
          </tr>
        );
      });
  }

  render() {
    return (
      <div
        className="container mx-auto  mt-3"
        style={{ color: this.props.textColor }}
      >
        <h1 className="display-6 text-center">Notes</h1>

        <br />

        <div className="container d-flex justify-content-center">
          <div className="form-check mx-2">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault1"
              onChange={this.props.setFilter.bind(this, "all")}
              checked={this.props.filter === "all"}
            />
            <label className="form-check-label" htmlFor="flexRadioDefault1">
              All
            </label>
          </div>
          <br />
          <div className="form-check mx-2">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault2"
              onChange={this.props.setFilter.bind(this, "completed")}
              checked={this.props.filter === "completed"}
            />
            <label className="form-check-label" htmlFor="flexRadioDefault2">
              Completed
            </label>
          </div>

          <div className="form-check mx-2">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault3"
              onChange={this.props.setFilter.bind(this, "waiting")}
              checked={this.props.filter === "waiting"}
            />
            <label className="form-check-label" htmlFor="flexRadioDefault3">
              Waiting
            </label>
          </div>
        </div>

        <br />
        {this.props.loading && this.props.updatedNotes.length !== 0 ? (
          <Loader />
        ) : (
          <table className="table table-striped">
            <col style={{ width: "80%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "10%" }} />
            <thead>
              <tr>
                <th scope="col">Note</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>{this.renderNotes()}</tbody>
          </table>
        )}

        <br />
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Text of note"
            aria-label="Text of note"
            aria-describedby="button-addon2"
            maxLength={100}
            value={this.state.newNoteText}
            onChange={(e) => this.setState({ newNoteText: e.target.value })}
          />
          <div className="input-group-append">
            <button
              className="btn btn-warning"
              type="button"
              id="button-addon2"
              onClick={() => {
                //let new_text = this.state.newNoteText;
                if (this.state.newNoteText.length > 0) {
                  const note: INote = {
                    id: "id" + this.props.updatedNotes.length,
                    text: this.state.newNoteText,
                    done: false,
                  };
                  this.props.addNote(note);
                  this.setState({ newNoteText: "" });
                }
              }}
            >
              Add note
            </button>
          </div>
        </div>
        <br />
        <div className="d-flex justify-content-center">
          <button
            type="button"
            onClick={this.props.saveNotes.bind(this)}
            className={"btn btn-warning " + classes.saveButton}
            disabled={isEqual<INote>(this.props.notes, this.props.updatedNotes)}
          >
            Save notes
          </button>
        </div>
        <br />
        <br />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteList);
