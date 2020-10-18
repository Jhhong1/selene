<template>
    <div class="bg-color">
        <el-row>
            <el-col :span="12">
                <div class="grid-content bg-purple-light">键</div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple-light">值</div>
            </el-col>
        </el-row>
        <template v-if="show">
            <template v-if="parameters !== undefined && parameters.length">
                <el-row v-for="(param, index) in parameters" :key="index" :gutter="3">
                    <el-col :span="12">
                        <el-input v-model="param.name" @change="changeValue(param, index)" size="mini"></el-input>
                    </el-col>
                    <el-col :span="11">
                        <el-input v-model="param.value" @change="changeValue(param, index)" size="mini"></el-input>
                    </el-col>
                    <el-col :span="1" class="icon-size">
                        <el-button icon="el-icon-minus" circle @click="remove(param)"></el-button>
                    </el-col>
                </el-row>
            </template>
            <template v-else>
                <el-row class="no-data-show">
                    <el-col :span="24">
                        无数据
                    </el-col>
                </el-row>
            </template>
            <el-row class="row-class">
                <el-col :span="24" class="col-class ch-button">
                    <el-button type="text" @click="add" class="add-class el-col-24" icon="el-icon-circle-plus-outline">添加</el-button>
                </el-col>
            </el-row>
        </template>
        <template v-else>
            <template v-if="parameters !== undefined && parameters.length">
                <el-row v-for="(param, index) in parameters" :key="index" class="asserts-row">
                    <el-col :span="12">
                        {{ param.name }}
                    </el-col>
                    <el-col :span="12">
                        <template v-if="param.value.length < 50">
                            {{ param.value }}
                        </template>
                        <template v-else>
                            <el-popover trigger="hover" placement="top-start">
                                <p>{{ param.value }}</p>
                                <div slot="reference" class="name-wrapper">
                                    {{ param.value }}
                                </div>
                            </el-popover>
                        </template>
                    </el-col>
                </el-row>
            </template>
            <template v-else>
                <el-row class="no-data-show">
                    <el-col :span="24">
                        无数据
                    </el-col>
                </el-row>
            </template>
        </template>
    </div>
</template>

<script>
export default {
    name: 'Input',
    props: {
        value: Object,
        edit: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            resources: this.value,
            show: this.edit,
            parameters: []
        }
    },
    methods: {
        add() {
            this.parameters.push({ name: '', value: '' })
        },
        remove(item) {
            let index = this.parameters.indexOf(item)
            if (index !== -1) {
                this.parameters.splice(index, 1)
                delete this.resources[item.name]
            }
        },
        changeToArry(sources, dest) {
            for (let key in sources) {
                let r = {}
                r['name'] = key
                r['value'] = sources[key]
                dest.push(r)
            }
        },
        changeToObj(item) {
            let obj = {}
            for (let i = 0, len = item.length; i < len; i++) {
                delete item[i]['index']
                Object.assign(obj, item[i])
            }
            return obj
        },
        makeNewArray(sources, param, index) {
            let tempArray = []
            for (let i = 0, len = sources.length; i < len; i++) {
                let item = sources[i]
                if (item.name) {
                    let tempObj = {}
                    tempObj[item.name] = item.value
                    tempObj['index'] = i
                    tempArray.push(tempObj)
                }
            }
            for (let id = 0, arrayLen = tempArray.length; id < arrayLen; id++) {
                let arr = {}
                if (tempArray[id].index === index) {
                    arr[param.name] = param.value
                    arr['index'] = index
                    tempArray[id] = arr
                }
            }
            return this.changeToObj(tempArray)
        },
        changeValue(param, index) {
            let tempVal = this.makeNewArray(this.parameters, param, index)
            this.resources = Object.assign(this.resources, tempVal)
        }
    },
    watch: {
        value: function(newValue) {
            this.resources = newValue
            this.parameters = []
            this.changeToArry(newValue, this.parameters)
        }
    }
}
</script>

<style scoped>
.icon-size {
    padding: 0;
    /*margin-left: 30%;*/
}
.row-class {
    margin-bottom: 1px;
    text-align: center;
}
.name-wrapper {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.ch-button >>> .el-button {
    padding: 0 !important;
}
.icon-size >>> .is-circle {
    padding: 0 !important;
}
</style>
