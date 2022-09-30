/*
 * This represents a convenience component that simply performs a useful general calculation.
 *
 * @author Dennis Quan
 * @author Robert Duvall
 */
 
<template>
    <span>{{ numItems }} {{ label }}{{ pluralize }}</span>
</template>

<script>
export default {
    name: 'ListCount',
    props: {
        // list to be counted
        list: {
            type: Array,
            required: true
        },
        // optional label to be displayed with count
        label: {
            type: String,
            default: ''
        }
    },

    computed: {
        // report list's length
        numItems () {
            return this.list.length;
        },
        // add 's' only if number warrants it
        pluralize () {
            return this.label && this.numItems > 1 ? 's' : '';
        }
    },
}
</script>
