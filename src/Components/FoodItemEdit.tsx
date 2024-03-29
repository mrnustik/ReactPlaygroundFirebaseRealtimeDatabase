import React from "react";
import {FoodItem} from "../Data";
import {FirebaseProps, withFirebase} from "./FirebaseContext";
import {Form, Button} from "react-bootstrap";

interface FoodItemEditProps extends FirebaseProps {
    editedItem?: FoodItem;
    onFinished: () => void;
}

interface FoodItemEditState {
    editedItem: FoodItem;
}

class FoodItemEdit extends React.Component<FoodItemEditProps, FoodItemEditState> {

    static getDerivedStateFromProps(props: FoodItemEditProps, current_state: FoodItemEditState) {
        if (props.editedItem) {
            if (props.editedItem.id === current_state.editedItem.id)
                return current_state;
            else
                return {
                    editedItem: props.editedItem
                };
        } else if (current_state.editedItem.id !== "") {
            return {
                editedItem: {
                    key: "",
                    name: "",
                    addedByUser: "react@app.js",
                    completed: false
                }
            }
        }
        return null;
    }

    constructor(props: Readonly<FoodItemEditProps>) {
        super(props);
        this.state = {
            editedItem: {
                id: "",
                name: "",
                addedByUser: "react@app.js",
                completed: false
            }
        }
    }

    private saveItem() {
        if (this.state.editedItem.name.length === 0) {
            alert("Missing name. Enter name of the item.");
            return;
        }
        if (this.props.firebase != null) {
            this.props.firebase.saveOrUpdateItem(this.state.editedItem.id,
                this.state.editedItem.name,
                this.state.editedItem.addedByUser,
                this.state.editedItem.completed);
            this.resetEditedItem();
            this.props.onFinished();
        }
    }

    private resetEditedItem() {
        this.setState({
            editedItem: {
                id: "",
                name: "",
                addedByUser: "react@app.js",
                completed: false
            }
        });
    }

    private nameChanged(event: React.FormEvent<HTMLInputElement>) {
        this.setState({
            editedItem: {
                ...this.state.editedItem,
                name: event.currentTarget.value
            }
        })
    }

    private completedChanged(event: React.FormEvent<HTMLInputElement>) {
        this.setState({
            editedItem: {
                ...this.state.editedItem,
                completed: event.currentTarget.checked
            }
        })
    }

    render() {
        return (
            <div>
                <Form>
                    <Form.Group controlId="nameInput">
                        <Form.Label>Name: </Form.Label>
                        <Form.Control type="text" placeholder="Item name" value={this.state.editedItem.name}
                                      onChange={this.nameChanged.bind(this)}/>
                    </Form.Group>
                    <Form.Group controlId="completedChecbkox">
                        <Form.Check label="Completed" type="checkbox" checked={this.state.editedItem.completed}
                                    onChange={this.completedChanged.bind(this)}/>
                    </Form.Group>
                    <Button variant="primary" onClick={this.saveItem.bind(this)}>
                        Save
                    </Button>
                </Form>
            </div>)
    }
}

export default withFirebase(FoodItemEdit);