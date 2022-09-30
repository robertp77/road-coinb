/*
 * This represents an input form for adding a new link interactively.
 *
 * This is an example of an input element replacement component, it emits
 * custom events and does not modify the primary data store.
 *
 * @author Dennis Quan
 * @author Robert Duvall
 */

// display form input fields or button as appropriate
<template>
    <div class="add-item">
        <!-- conditionally allow new information too be added inline -->
        <div v-if="isEditing">
            <label for="linkName-new">{{ nameLabel }}</label>
            <input type="text" id="linkName-new" v-model="userContent.name" />
            <label for="linkURL-new">{{ urlLabel }}</label>
            <!-- allow enter to add item instead of requiring button press -->
            <input type="text" id="linkURL-new" v-model="userContent.url" @keyup.enter="newLink" />
            <b-button variant="success" @click="newLink">Add Link</b-button>
            <b-button variant="danger" @click="reset">Cancel</b-button>
        </div>
        <b-icon v-else @click="isEditing=true" icon="plus-square"></b-icon>
    </div>
</template>

<script>
// avoid duplication so only need to update form state once if it changes
function makeNewState () {
    return { userContent: { name: '', url: '' }, isEditing: false };
}

export default {
    name: 'AddLink',
    props: {
        // allow labels to be customized
        nameLabel: {
            type: String,
            default: 'Name:',
        },
        // allow labels to be customized
        urlLabel: {
            type: String,
            default: 'URL:',
        },
    },

    data () {
        // avoid duplication by using a function to set the initial state
        return makeNewState();
    },

    methods: {
        // emit event only if form has been completed
        newLink () {
            // make sure something has been entered into the form
            if (this.userContent.name && this.userContent.url) {
                console.log(`EVENT: new item ${this.userContent.name}`);
                this.$emit('new-link', this.userContent);
                this.reset();
            }
        },
        // clear input form to prepare for the next entry
        reset () {
            // set this object's fields to the results of the function
            Object.assign(this, makeNewState());
        }
    },
}
</script>
