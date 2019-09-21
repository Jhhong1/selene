<template>
    <div>
        <div class="jsoneditor-vue"></div>
    </div>
</template>

<script>
import JSONEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.css'
export default {
    name: 'VueEditor',
    props: {
        value: Object,
        mode: String,
        modes: Array,
        edit: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            editor: null,
            error: false,
            json: this.value,
            internalChange: false
        }
    },
    mounted() {
        var self = this
        var mode = 'code'
        var modes = ['tree', 'code', 'form', 'text', 'view']
        if (this.mode !== undefined) mode = this.mode
        if (!this.modes !== undefined) modes = this.modes
        let options = {}
        if (this.edit) {
            options = {
                mode: mode,
                modes: modes,
                onChange() {
                    try {
                        var json = self.editor.get()
                        self.error = false
                    } catch (e) {
                        self.error = true
                        self.$emit('has-error')
                    }
                    if (!self.error) {
                        self.json = json
                        self.$emit('json-change', json)
                        self.internalChange = true
                        self.$emit('input', json)
                        self.$nextTick(function() {
                            self.internalChange = false
                        })
                    }
                }
            }
        } else {
            options = {
                mode: mode,
                modes: modes,
                onChange() {
                    try {
                        var json = self.editor.get()
                        self.error = false
                    } catch (e) {
                        self.error = true
                        self.$emit('has-error')
                    }
                    if (!self.error) {
                        self.json = json
                        self.$emit('json-change', json)
                        self.internalChange = true
                        self.$emit('input', json)
                        self.$nextTick(function() {
                            self.internalChange = false
                        })
                    }
                },
                onEditable(node) {
                    if (!node.path) {
                        return false
                    }
                }
            }
        }
        this.editor = new JSONEditor(this.$el.querySelector('.jsoneditor-vue'), options, this.json)
    },
    watch: {
        value: function(newValue) {
            try {
                if (!this.internalChange) {
                    this.editor.set(newValue)
                }
            } catch (e) {}
        }
    }
}
</script>

<style>
div .jsoneditor {
    height: 300px;
    overflow: scroll;
    border: 1px solid lightgray;
}
div.jsoneditor-menu {
    background-color: #e5e9f2;
    border-bottom: 1px solid white;
}
.jsoneditor-menu .jsoneditor-poweredBy {
    display: none;
}
div.jsoneditor-outer.has-status-bar {
    padding-bottom: 0;
}
</style>
