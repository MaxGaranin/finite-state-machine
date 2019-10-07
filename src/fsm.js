class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.states = config.states;
        this.initial = config.initial;
        this.state = config.initial;

        this.clearHistory();
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (this.states[state] == undefined) {
            throw new Error('Illegal state for changing');
        };

        this.state = state;
        this._addStateToHistory();
    }

    _addStateToHistory() {
        this.historyIndex++;
        this.history[this.historyIndex] = this.state;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let transitions = this.states[this.state].transitions;
        
        for (const key in transitions) {
            if (event == key) {
                this.state = transitions[event];
                this._addStateToHistory();
                return;
            }
        }

        throw new Error("Can't apply the transition");
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = this.initial;
        this.clearHistory();
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (event == undefined) {
            return Object.keys(this.states);
        }

        let result = [];

        for (const stateKey in this.states) {
            let transitions = this.states[stateKey].transitions;

            if (transitions[event] != undefined) {
                result.push(stateKey);
            }
        }

        return result;

    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() { 
        if (this.historyIndex == 0) return false;

        this.historyIndex--;
        this.state = this.history[this.historyIndex];
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() { 
        if (this.historyIndex == this.history.length - 1) return false;

        this.historyIndex++;
        this.state = this.history[this.historyIndex];
        return true;

    }

    /**
     * Clears transition history
     */
    clearHistory() { 
        this.history = [this.initial];
        this.historyIndex = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
