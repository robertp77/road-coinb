/*
 * This represents a convenience component that simply displays a object's data.
 *
 * @author Dennis Quan
 * @author Robert Duvall
 */

// display basic href based on given data, but could add extra attributes or features
<template>
    <a :href="link.url">{{ link.name }}</a>
</template>

<script>
export default {
    name: 'UrlLink',
    props: {
        // object to display
        link: {
            type: Object,
            required: true,
        }
    },
}
</script>
