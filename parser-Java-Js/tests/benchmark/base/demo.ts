import { Service } from 'egg'
import { HostDAO } from '../dao/hostDAO'
import { ServiceDAO } from '../dao/serviceDAO'
import { ConfigDataDAO } from '../dao/configDataDAO';
import { ConfigGroupDAO } from '../dao/configGroupDAO';
import { throwCustomError } from '../errors'
import * as moment from 'moment'

const ERROR = require('../enums/errors')
const md5 = require('md5')

declare module 'egg' {
    export interface IService {
        summary: ServiceSummary;
    }
}

export class ServiceSummary extends Service {
    public ret = {}
    public async getSummary (serviceName: string) {
        console.log(serviceName)
    }
}

export class RESOURCEMANAGER extends ServiceSummary {

    /**
     * 根据rm的服务名查询rm的active的主机
     *
     * @param {any} rmServiceName  //resource manager的服务名
     * @returns
     * @memberof RESOURCEMANAGER
     */
    public async getRmActiveHostByRmServiceName (rmServiceName) {
        let rmActiveHost = null
        let serviceStatusRecord = await this.ctx.service.sql.select('service_status', {
            where: {
                idx_service_name: rmServiceName,
                service_type: 'RESOURCEMANAGER'
            },
            columns: ['full_host_name']
        })

        const options = {
            method: 'GET',
            timeout: 10000,
            dataType: 'json'
        }

        for (let i = 0; i < serviceStatusRecord.length; i++) {
            let fullHostName = serviceStatusRecord[i].full_host_name
            let url = 'http://' + fullHostName + ':8088/ws/v1/cluster/info'
            try {
                const ret = await this.ctx.curl(url, options)
                if (ret.status === 200) { //返回成功
                    let data = ret.data
                    let haState = data.clusterInfo.haState
                    if (haState === 'ACTIVE') { //rm取得active的host
                        rmActiveHost = fullHostName
                        break
                    }
                }
            } catch (err) {
                this.ctx.logger.info(err)
                rmActiveHost = null
            }
        }
        return rmActiveHost
    }

    /**
     * 得到某个队列的任务列表
     *
     * @param {any} rmServiceName  //resource manager的服务名
     * @returns
     * @memberof RESOURCEMANAGER
     */
    public async getApps (rmActiveHost, queueName) {
        const options = {
            method: 'GET',
            timeout: 10000,
            dataType: 'json'
        }
        let url = 'http://' + rmActiveHost + ':8088/ws/v1/cluster/apps?queue=' + queueName

        let apps = []
        try {
            const ret = await this.ctx.curl(url, options)

            if (ret.status === 200) {
                apps = ret.data.apps.app
            }
        } catch (err) {
            this.ctx.logger.info(err)
            apps = []
        }

        return apps
    }

    /**
     * token 目前通过 yarn-site.xml 的 yarn.resourcemanager.restful_api_tokens 配置，多个 token 之间逗号分隔
     *
     * @param {string} serviceName
     * @param {string} rmActiveHost
     * @memberof RESOURCEMANAGER
     */
    private async getTokenOfSubmitPriority (serviceName: string, rmActiveHost: string) {
        let ret = await this.ctx.dao.serviceStatus.selectOne({
            idxServiceName: serviceName,
            fullHostName: rmActiveHost
        })
        let configGroupId = ret.configGroupId
        let currentVersion = await ConfigGroupDAO.getCurrentVersionById(configGroupId, this.ctx)
        let configdataRecord = await ConfigDataDAO.getByConfigGroupIdAndVersion(configGroupId, currentVersion, this.ctx)
        //多个 token 之间逗号分隔
        let tokenStr = await this.ctx.service.config.getValueByFilekey(JSON.parse(configdataRecord.configData), 'yarn-site.xml', 'yarn.resourcemanager.restful_api_tokens')
        let tokenArr = tokenStr.split(',')
        return tokenArr
    }

    /**
     * 阻止某个队列的xx优先级以下的任务提交，含 xx 优先级
     *
     * @returns
     * @memberof RESOURCEMANAGER
     */
    public async setSubmitPriority (serviceName, rmActiveHost, queueName, priority) {
        let tokenArr = await this.getTokenOfSubmitPriority(serviceName, rmActiveHost)
        let token = tokenArr && tokenArr.length ? tokenArr[0] : ''
        const options = {
            method: 'POST',
            timeout: 1000,
            dataType: 'json'
        }
        let url = 'http://' + rmActiveHost + ':8088/ws/v1/cluster/queue/' + queueName + '/submitPriority/' + priority + '?token=' + token
        try {
            const ret = await this.ctx.curl(url, options)
            if (ret.status !== 200) {
                throwCustomError(ERROR.E_YARN_REST_ERROR, {message: ret.data.diagnostics})
            }
        } catch (err) {
            this.ctx.logger.info(err)
            throw err
        }
    }

    public async killAppsUnderPriority (serviceName, rmActiveHost, queueName, priority) {
        let tokenArr = await this.getTokenOfSubmitPriority(serviceName, rmActiveHost)
        let token = tokenArr && tokenArr.length ? tokenArr[0] : ''
        const options = {
            method: 'POST',
            timeout: 1000,
            dataType: 'json'
        }
        let url = 'http://' + rmActiveHost + ':8088/ws/v1/cluster/queue/' + queueName + '/killAppsUnderPriority/' + priority + '?token=' + token
        try {
            const ret = await this.ctx.curl(url, options)
            if (ret.status !== 200) {
                throwCustomError(ERROR.E_YARN_REST_ERROR, {message: ret.data.diagnostics})
            }
        } catch (err) {
            this.ctx.logger.info(err)
            throw err
        }
    }

    public async getSubmitPriorityOfQueue (rmActiveHost: string, queueName: string) {
        let submitPriority = '-2147483648'
        const options = {
            method: 'GET',
            timeout: 10000,
            dataType: 'json'
        }
        let url = 'http://' + rmActiveHost + ':8088/ws/v1/cluster/queue/' + queueName + '/submitPriority'
        try {
            const ret = await this.ctx.curl(url, options)
            if (ret.status === 200) { //返回成功
                let data = ret.data
                let priorityInfo = data.priorityInfo
                submitPriority = priorityInfo
            }
        } catch (err) {
            this.ctx.logger.info(err)
            submitPriority = '未知'
        }
        return submitPriority
    }

    public async getSummary (serviceName: string) {
        const options = {
            method: 'GET',
            timeout: 10000,
            dataType: 'json'
        }

        let rmHost
        let serviceStatusRecord = await this.ctx.service.sql.select('service_status', {
            where: {
                idx_service_name: serviceName,
                service_type: 'RESOURCEMANAGER'
            },
            columns: ['full_host_name']
        })

        this.ret['haState'] = []
        for (let i = 0; i < serviceStatusRecord.length; i++) {
            let fullHostName = serviceStatusRecord[i].full_host_name
            let url = 'http://' + fullHostName + ':8088/ws/v1/cluster/info'
            try {
                const ret = await this.ctx.curl(url, options)
                if (ret.status === 200) { //返回成功
                    let data = ret.data
                    let haState = data.clusterInfo.haState
                    let state = data.clusterInfo.state
                    if (haState === 'ACTIVE') { //rm取得active的host
                        rmHost = fullHostName
                        this.ret['rmActiveHost'] = rmHost
                    }
                    this.ret['haState'].push({
                        rmHost: fullHostName,
                        state: state,
                        haState: haState
                    })
                }
            } catch (err) {
                this.ctx.logger.info(err)
                this.ret['haState'].push({
                    rmHost: fullHostName,
                    state: 'n/a',
                    haState: 'n/a'
                })
            }
        }
        //得到metrics统计信息
        try {
            let url = 'http://' + rmHost + ':8088/ws/v1/cluster/metrics'
            let ret = await this.ctx.curl(url, options)

            if (ret.status === 200) {  //返回成功
                let data = ret.data
                //得到NodeManagers Status的统计信息
                let nmStatus = data.clusterMetrics.totalNodes + ' total / ' +
                    data.clusterMetrics.activeNodes + ' active / ' +
                    data.clusterMetrics.lostNodes + ' lost / ' +
                    data.clusterMetrics.unhealthyNodes + ' unhealthy / ' +
                    data.clusterMetrics.rebootedNodes + ' rebooted / ' +
                    data.clusterMetrics.decommissioningNodes + ' decommissioning / ' +
                    data.clusterMetrics.decommissionedNodes + ' decommissioned / ' +
                    data.clusterMetrics.shutdownNodes + ' shutdown'
                //得到Applications的统计信息
                let applicationStatus = data.clusterMetrics.appsSubmitted + ' submitted / ' +
                    data.clusterMetrics.appsCompleted + ' completed / ' +
                    data.clusterMetrics.appsPending + ' pending / ' +
                    data.clusterMetrics.appsRunning + ' running / ' +
                    data.clusterMetrics.appsFailed + ' failed / ' +
                    data.clusterMetrics.appsKilled + ' killed'
                //得到Containers的统计信息
                let containerStatus = data.clusterMetrics.containersAllocated + ' allocated / ' +
                    data.clusterMetrics.containersReserved + ' pending / ' +
                    data.clusterMetrics.containersPending + ' reserved'
                //得到Cluster Memory的统计信息
                let clusterMemoryStatus = (data.clusterMetrics.totalMB / 1024.0).toFixed(2) + ' GB total / ' +
                    (data.clusterMetrics.availableMB / 1014.0).toFixed(2) + ' GB available / ' +
                    (data.clusterMetrics.allocatedMB / 1024.0).toFixed(2) + ' GB allocated / ' +
                    (data.clusterMetrics.reservedMB / 1024.0).toFixed(2) + ' GB reserved'
                this.ret['nmStatus'] = nmStatus
                this.ret['applicationStatus'] = applicationStatus
                this.ret['containerStatus'] = containerStatus
                this.ret['clusterMemoryStatus'] = clusterMemoryStatus
            }
        } catch (err) {
            this.ctx.logger.info(err)
            this.ret['nmStatus'] = 'n/a total / n/a active / n/a lost / n/a unhealthy / n/a rebooted / n/a decommissioning / n/a decommissioned / n/a shutdown'
            this.ret['applicationStatus'] = 'n/a submitted / n/a completed / n/a pending / n/a running / n/a failed / n/a killed'
            this.ret['containerStatus'] = 'n/a allocated / n/a pending / n/a reserved'
            this.ret['clusterMemoryStatus'] = 'n/a GB total / n/a GB available / n/a GB allocated / n/a GB reserved'
        }

        //得到任务队列信息
        try {
            let url = 'http://' + rmHost + ':8088/ws/v1/cluster/scheduler'
            let ret = await this.ctx.curl(url, options)
            if (ret.status === 200) { //返回成功
                this.ret['queue'] = []
                let data = ret.data
                //queue是队列数组
                let root = data.scheduler.schedulerInfo.queueName
                let queue = data.scheduler.schedulerInfo.queues.queue

                for (let i = 0; i < queue.length; i++) {
                    let item = queue[i]
                    let queueName = root + '.' + item.queueName
                    let state = item.state
                    let numApplications = parseInt(item.numApplications)
                    let capacityInfo = []
                    if (item.capacities.queueCapacitiesByPartition && item.capacities.queueCapacitiesByPartition.length) {
                        const queueCapacitiesByPartition = item.capacities.queueCapacitiesByPartition
                        let partitionName = null
                        for (let i = 0; i < queueCapacitiesByPartition.length; i++) {
                            partitionName = queueCapacitiesByPartition[i].partitionName
                                ? queueCapacitiesByPartition[i].partitionName : '<DEFAULT_PARTITION>'
                            let capacity = queueCapacitiesByPartition[i].capacity.toFixed(2)
                            let usedCapacity = queueCapacitiesByPartition[i].usedCapacity.toFixed(2)
                            let maxCapacity = queueCapacitiesByPartition[i].maxCapacity.toFixed(2)
                            let absoluteCapacity = queueCapacitiesByPartition[i].absoluteCapacity.toFixed(2)
                            let absoluteUsedCapacity = queueCapacitiesByPartition[i].absoluteUsedCapacity.toFixed(2)
                            let absoluteMaxCapacity = queueCapacitiesByPartition[i].absoluteMaxCapacity.toFixed(2)
                            capacityInfo.push({
                                partitionName,
                                capacity,
                                usedCapacity,
                                maxCapacity,
                                absoluteCapacity,
                                absoluteUsedCapacity,
                                absoluteMaxCapacity
                            })
                        }
                    }
                    let submitPriority = await this.getSubmitPriorityOfQueue(rmHost, queueName)
                    let queueItem = {
                        queueName,
                        state,
                        numApplications,
                        submitPriority,
                        capacityInfo
                    }
                    this.ret['queue'].push(queueItem)
                }
            }
        } catch (err) {
            this.ctx.logger.info(err)
            this.ret['queue'] = []
        }
    }
}

export class NODEMANAGER extends ServiceSummary {
    /**
     * 根据NM的serviceName查找RM的active主机
     *
     * @param {string} nmServiceName nm服务名
     * @returns 返回active的RM主机名
     * @memberof NODEMANAGER
     */
    public async getActiveRmHostByNmServiceName (nmServiceName: string) {
        let serviceRecord = await this.ctx.service.sql.select('service', {
            where: {
                idx_service_name: nmServiceName
            },
            columns: ['cluster_name']
        })

        let clusterName = serviceRecord.length ? serviceRecord[0].cluster_name : ''

        //查询与 nodemanager 集群同一集群下的 resourcemanager 的service name
        serviceRecord = await this.ctx.service.sql.select('service', {
            where: {
                cluster_name: clusterName,
                idx_service_type: 'RESOURCEMANAGER'
            },
            columns: ['idx_service_name']
        })

        //同一YARN集群下的RM的serviceName
        let rmServcieName = serviceRecord.length ? serviceRecord[0].idx_service_name : ''
        let resourceManager = new RESOURCEMANAGER(this.ctx)
        let rmActiveHost = await resourceManager.getRmActiveHostByRmServiceName(rmServcieName)
        return rmActiveHost
    }

    /**
     * 返回该YARN集群中的队列信息
     * 返回格式参考 https://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/ResourceManagerRest.html#Cluster_Scheduler_API
     *
     * @param {string} rmActiveHost //active的RM主机名
     * @returns
     * @memberof RESOURCEMANAGER
     */
    public async getClusterQueuesByRmHost (rmActiveHost: string) {
        const options = {
            method: 'GET',
            timeout: 10000,
            dataType: 'json'
        }
        let queues = []
        //得到任务队列信息
        try {
            let url = 'http://' + rmActiveHost + ':8088/ws/v1/cluster/scheduler'
            let ret = await this.ctx.curl(url, options)
            if (ret.status === 200) { //返回成功
                let data = ret.data
                queues = data.scheduler.schedulerInfo.queues.queue
            }
        } catch (err) {
            this.ctx.logger.info(err)
            queues = []
        }
        return queues
    }

    public async getPartitionsByNmServiceName (nmServiceName: string) {
        let rmActiveHost = await this.getActiveRmHostByNmServiceName(nmServiceName)
        // rmActiveHost = 'rm-dsaas.prefromoffice.xxxxx.net'
        return this.getPartitionsByRmHost(rmActiveHost)
    }

    /**
     * 得到集群中所有的partition(label)
     *
     * @param {string} rmActiveHost //active的RM主机名
     * @returns 返回partition数组
     * @memberof NODEMANAGER
     */
    public async getPartitionsByRmHost (rmActiveHost: string) {
        const options = {
            method: 'GET',
            timeout: 10000,
            dataType: 'json'
        }
        let partitions = []
        //得到任务队列信息
        try {
            let url = 'http://' + rmActiveHost + ':8088/ws/v1/cluster/scheduler'
            let ret = await this.ctx.curl(url, options)
            if (ret.status === 200) { //返回成功
                let data = ret.data
                partitions = data.scheduler.schedulerInfo.partitions.map(item => item.partitionName)
            }
        } catch (err) {
            this.ctx.logger.info(err)
            partitions = []
        }
        return partitions
    }

    /**
     * 查询nmServiceName下的所有node节点信息
     * @param {string} nmServiceName  //nodemanager的服务名
     * @returns
     * @memberof NODEMANAGER
     */
    public async getClusterNodesByNmServiceName (nmServiceName: string) {
        let rmActiveHost = await this.getActiveRmHostByNmServiceName(nmServiceName)
        return this.getClusterNodesByRmHost(rmActiveHost)
    }

    /**
     * 查询nmServiceName下的所有node节点信息
     * 返回格式参考 https://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/ResourceManagerRest.html#Cluster_Nodes_API
     *
     * @param {string} rmActiveHost //active的RM主机名
     * @returns
     * @memberof NODEMANAGER
     */
    public async getClusterNodesByRmHost (rmActiveHost: string) {
        let nodes = []
        const options = {
            method: 'GET',
            timeout: 10000,
            dataType: 'json'
        }
        try {
            let url = 'http://' + rmActiveHost + ':8088/ws/v1/cluster/nodes'
            const ret = await this.ctx.curl(url, options)
            if (ret.status === 200) { //返回成功
                nodes = ret.data.nodes.node //node数组
            }
        } catch (err) {
            nodes = []
        }
        return nodes
    }

    /**
     * 查询node的信息
     * 返回格式参考 https://hadoop.apache.org/docs/current/hadoop-yarn/hadoop-yarn-site/ResourceManagerRest.html#Cluster_Node_API
     *
     * @param {string} rmActiveHost   //active的RM主机名
     * @param {string} nmFqdn         //nm的主机长域名
     * @returns 返回该node的详情信息
     * @memberof NODEMANAGER
     */
    public async getNodeInfo (nmServiceName: string, nmFqdn: string) {
        let rmActiveHost = await this.getActiveRmHostByNmServiceName(nmServiceName)
        let nodeInfo = null
        const options = {
            method: 'GET',
            timeout: 10000,
            dataType: 'json'
        }
        try {
            let url = 'http://' + rmActiveHost + ':8088/ws/v1/cluster/nodes/' + nmFqdn + ':45454'
            let ret = await this.ctx.curl(url, options)
            if (ret.status === 200) { //返回成功
                nodeInfo = ret.data.node
            } else if (ret.status === 404) {
                let record = await HostDAO.fullHostNameListMapHostNameListWithOrder([nmFqdn], this.ctx)
                let hostName = record ? record[nmFqdn].hostName : ''
                url = 'http://' + rmActiveHost + ':8088/ws/v1/cluster/nodes/' + hostName + ':45454'
                ret = await this.ctx.curl(url, options)
                if (ret.status === 200) {
                    nodeInfo = ret.data.node
                }
            }
        } catch (err) {
            this.ctx.logger.info(err)
            nodeInfo = null
        }
        return nodeInfo
    }

    /**
     * 得到集群中所有机器和label的对应关系
     *
     * @param {string} nmServiceName
     * @returns
     * @memberof NODEMANAGER
     */
    public async getNodeToLabels (nmServiceName: string) {
        // console.log('nmServiceName', nmServiceName)
        // let rmActiveHost = 'antyarn1.inc.xxxxx.net'
        let rmActiveHost = await this.getActiveRmHostByNmServiceName(nmServiceName)
        let entry = []
        const options = {
            method: 'GET',
            timeout: 10000,
            dataType: 'json'
        }
        try {
            let url = 'http://' + rmActiveHost + ':8088/ws/v1/cluster/get-node-to-labels'
            let ret = await this.ctx.curl(url, options)
            if (ret.status === 200) { //返回成功
                entry = ret.data.nodeToLabels.entry
            }
        } catch (err) {
            this.ctx.logger.info(err)
            entry = []
        }
        return entry
    }

    /**
     * 得到nm服务的某个机器的label
     *
     * @param {string} nmServiceName
     * @param {string} nmFqdn
     * @returns
     * @memberof NODEMANAGER
     */
    public async getLabelOfNode (nmServiceName: string, nmFqdn: string) {
        let label = null
        try {
            let nodeToLabels = await this.getNodeToLabels(nmServiceName)

            let record = await HostDAO.fullHostNameListMapHostNameListWithOrder([nmFqdn], this.ctx)
            let hostName = record ? record[nmFqdn].hostName : ''

            for (let i = 0; i < nodeToLabels.length; i++) {
                let key = nodeToLabels[i].key

                key = key.replace(':45454', '')

                if (key === nmFqdn || key === hostName) {
                    label = nodeToLabels[i].value.nodeLabelInfo.name
                    break
                }
            }
        } catch (err) {
            this.ctx.logger.info(err)
            label = null
        }
        return label
    }

    /**
     * 查询机器标签为label的node列表
     *
     * @param {string} nmServiceName //nodemanager服务名
     * @param {string[]} labelList   //需要检索的label数组
     * @returns
     * @memberof NODEMANAGER
     */
    public async getNodeListByLabel (nmServiceName: string, labelList: string[]) {

        // rmActiveHost = 'rm2-dsaas.prefromoffice.xxxxx.net'

        let nodeToLabels = await this.getNodeToLabels(nmServiceName)
        let nodeHostList = []
        nodeToLabels.map(item => {
            let key = item.key
            key = key.replace(':45454', '')  //主机名
            let label = item.value.nodeLabelInfo.name
            if (labelList.indexOf(label) >= 0) {
                nodeHostList.push(key)
            }
        })

        //如果要查的分区包含默认分区
        if (labelList.indexOf('<DEFAULT_PARTITION>') >= 0) {
            let defaultPartitionNodeHostList = await this.searchDefaultPartitionNodeList(nmServiceName)
            nodeHostList = nodeHostList.concat(defaultPartitionNodeHostList)
        }

        return nodeHostList
    }

    private async searchDefaultPartitionNodeList (nmServiceName: string) {
        let rmActiveHost = await this.getActiveRmHostByNmServiceName(nmServiceName)
        let nodes = await this.getClusterNodesByRmHost(rmActiveHost)

        let defaultPartitionNodeHostList = []
        nodes.map(item => {
            if (!item.nodeLabels || !item.nodeLabels[0]) {
                let nodeHostName = item.nodeHostName
                defaultPartitionNodeHostList.push(nodeHostName)
            }
        })
        return defaultPartitionNodeHostList
    }

    /**
     * 根据nodemanager服务名得到集群元数据信息
     *
     * @param {string} nmServiceName //nm的服务名
     * @returns 返回集群元数据信息
     * @memberof NODEMANAGER
     */
    public async getClusterMetaOfNodeList (nmServiceName: string) {
        let rmActiveHost = await this.getActiveRmHostByNmServiceName(nmServiceName)

        // rmActiveHost = 'rm2-dsaas.prefromoffice.xxxxx.net'

        let nodes = await this.getClusterNodesByRmHost(rmActiveHost)
        let queues = await this.getClusterQueuesByRmHost(rmActiveHost)

        //记录每个label对应的有哪些队列
        let labelQueues = {}

        queues.map(item => {
            let queueName = item.queueName
            item.nodeLabels.map(label => {
                if (labelQueues[label]) {
                    labelQueues[label].push(queueName)
                } else {
                    labelQueues[label] = [queueName]
                }
            })
        })

        let hostList = nodes.map(item => {
            let EXT = {}
            let label = '<DEFAULT_PARTITION>'                //默认标签
            if (item.nodeLabels && item.nodeLabels.length) {
                label = item.nodeLabels[0]  //如果有标签,赋值为该标签值
            }
            EXT['partition'] = label
            EXT['queue'] = labelQueues[label] ? labelQueues[label] : []
            return {
                hostname: item.nodeHostName,
                EXT
            }
        })

        return hostList
    }

    public async getLabelsOfNodeList (nmServiceName: string, nmFqdnList: string[]) {
        let nodeToLabels = await this.getNodeToLabels(nmServiceName)
        let map = {} //记录每个nmfqdn的label
        for (let i = 0; i < nodeToLabels.length; i++) {
            let key = nodeToLabels[i].key
            key = key.replace(':45454', '')

            if (nmFqdnList.indexOf(key) >= 0) {
                let label = nodeToLabels[i].value.nodeLabelInfo.name
                map[key] = label
            }
        }

        let result = {}
        for (let nmFqdn of nmFqdnList) {
            let label = '<DEFAULT_PARTITION>'
            if (map[nmFqdn]) {
                label = map[nmFqdn]
            }
            if (!result[label]) {
                result[label] = []
            }
            result[label].push(nmFqdn)
        }
        return result
    }

    public async getSummary (nmServiceName) {
        // console.log('nmServiceName', nmServiceName)
        let rmActiveHost = await this.getActiveRmHostByNmServiceName(nmServiceName)
        // let rmActiveHost = 'antyarn1.inc.xxxxx.net'
        let nodes = await this.getClusterNodesByRmHost(rmActiveHost)

        this.ctx.logger.warn('nodes nodes nodes', JSON.stringify(nodes))

        let labelStateCountMap = {}  // 统计每个label下的每个状态的个数

        let partitions = await this.getPartitionsByRmHost(rmActiveHost)  //所有的label

        this.ctx.logger.warn('partitions partitions partitions', JSON.stringify(partitions))

        let allLabelStateCountMap = {
            TOTAL: 0,
            NEW: 0,
            RUNNING: 0,
            UNHEALTHY: 0,
            DECOMMISSIONED: 0,
            LOST: 0,
            REBOOTED: 0
        }

        if (!nodes.length || !partitions.length) {  //任意一个为空,直接返回
            this.ret['labelStateCountMap'] = labelStateCountMap
            this.ret['allLabelStateCountMap'] = allLabelStateCountMap
            this.ret['partitions'] = partitions
            this.ret['rmActiveHost'] = rmActiveHost
            return
        }

        partitions = partitions.map(item => {
            if (item === '') {
                item = '<DEFAULT_PARTITION>'
            }
            if (!labelStateCountMap[item]) {
                labelStateCountMap[item] = {
                    TOTAL: 0,
                    NEW: 0,
                    RUNNING: 0,
                    UNHEALTHY: 0,
                    DECOMMISSIONED: 0,
                    LOST: 0,
                    REBOOTED: 0
                }
            }
            return item
        })

        nodes.map(item => {
            let label = (item.nodeLabels && item.nodeLabels[0]) ? item.nodeLabels[0] : '<DEFAULT_PARTITION>'
            let state = item.state
            labelStateCountMap[label][state] += 1
            labelStateCountMap[label]['TOTAL'] += 1

            allLabelStateCountMap[state] += 1
            allLabelStateCountMap['TOTAL'] += 1
        })

        this.ret['labelStateCountMap'] = labelStateCountMap
        this.ret['allLabelStateCountMap'] = allLabelStateCountMap
        this.ret['partitions'] = partitions
        this.ret['rmActiveHost'] = rmActiveHost
    }
}

export class ZOOKEEPER extends ServiceSummary {
    /**
     * ZooKeeper Four Letter Word Command
     *
     * @param {string} flw //zk的四字命令
     * @param {string} ip  //执行该命令的ip地址
     * @param {string} clientPort  //执行该命令的ip地址
     * @param {string} [extendCmd=''] //扩展命令
     * @returns
     * @memberof ZOOKEEPER
     */
    public async zkflwcmd (flw: string, ip: string, clientPort: string = '2181', extendCmd = '') {
        const co = require('co')
        const { ctx } = this
        let cmd = 'echo ' + flw + `|nc -w 10 localhost ${clientPort}` + extendCmd
        let target = { ip: ip }
        let ret
        try {
            ret = await co(function * () { return yield ctx.service.staragent.cmd(target, 'admin', cmd, true) })
        } catch (err) {
            this.ctx.logger.info(err)
            ret = null
        }
        return ret
    }

    private async getClientPort(zkServiceName) {
        let ret = await this.ctx.dao.serviceStatus.selectOne({
            idxServiceName: zkServiceName,
        })
        let configGroupId = ret.configGroupId
        let currentVersion = await ConfigGroupDAO.getCurrentVersionById(configGroupId, this.ctx)
        let configdataRecord = await ConfigDataDAO.getByConfigGroupIdAndVersion(configGroupId, currentVersion, this.ctx)
        //得到 zoo.cfg 中的 clientPort
        let port = await this.ctx.service.config.getValueByFilekey(JSON.parse(configdataRecord.configData), 'zoo.cfg', 'clientPort')
        return port
    }

    public async getSummary (zkServiceName) {
        const properties = require('properties')

        let serviceStatusRecord = await this.ctx.service.sql.select('service_status', {
            where: {
                idx_service_name: zkServiceName
            },
            columns: ['full_host_name']
        })

        let clientPort = '2181'
        try {
            clientPort = await this.getClientPort(zkServiceName)
        } catch (err) {
            clientPort = '2181'
        }

        //初始化值
        this.ret['zkStatusList'] = []
        this.ret['zxid'] = {
            decimalZxid: 0,
            hexadecimalZxid: '0x0'
        }

        let hostList = serviceStatusRecord.map(item => item.full_host_name)

        if (hostList.length) {
            let result = await HostDAO.fullHostNameListMapIPListWithOrder(hostList, this.ctx)
            for (let zkHost in result) {
                let ip = result[zkHost]
                let status = {
                    zkHost,
                    ruok: 'unknown',
                    mode: 'unknown',
                    myid: 'unknown',
                    mntr: {}
                }

                let ruok = await this.zkflwcmd('ruok', ip, clientPort)
                if (ruok !== null && ruok.result && ruok.result.SUCCESS && ruok.result.SUCCESS === true) {
                    status.ruok = ruok.result.JOBRESULT    // imok or other
                }

                let conf = await this.zkflwcmd('conf', ip, clientPort)
                if (conf !== null && conf.result && conf.result.SUCCESS && conf.result.SUCCESS === true) {
                    let ret = properties.parse(conf.result.JOBRESULT)
                    status.myid = ret.serverId
                }

                let mntr = await this.zkflwcmd('mntr', ip, clientPort)
                if (mntr !== null && mntr.result && mntr.result.SUCCESS && mntr.result.SUCCESS === true) {
                    let ret = properties.parse(mntr.result.JOBRESULT)
                    status.mntr = ret
                }

                let srvr = await this.zkflwcmd('srvr', ip, clientPort)
                if (srvr !== null && srvr.result && srvr.result.SUCCESS && srvr.result.SUCCESS === true) {
                    let ret = properties.parse(srvr.result.JOBRESULT)

                    status.mode = ret.Mode ? ret.Mode : status.mode     //leader or follower

                    if (ret.Zxid) {  //zxid一次就获取到了
                        let decimalZxid = ret.Zxid ? ret.Zxid : -1        //10进制zxid (properties.parse解析会把16进制的zxid直接解析成10进制zxid)
                        let hexadecimalZxid = decimalZxid.toString(16)    //16进制zxid
                        this.ret['zxid'] = {
                            decimalZxid: decimalZxid >>> 32,        //关注zxid的低32位的值
                            hexadecimalZxid: '0x' + hexadecimalZxid
                        }
                    }
                }
                this.ret['zkStatusList'].push(status)
            }
        }
    }
}

export class KEPLERNIMBUS extends ServiceSummary {

    public async setTopologyOpsStatus (topologyId, opsStatus) {
        let initParams = await this.service.kepler.getInitParams()
        const options = {
            method: 'POST',
            timeout: 10000,
            dataType: 'json',
            contentType: 'json',
            data: {
                ...initParams
            }
        }
        let keplerUrl = await this.ctx.service.systemConfig.queryByKey('keplerUrl', 'SYSTEM_TEMPLATE')
        let url = `${keplerUrl}/api/job/${topologyId}/ops/${opsStatus.toLowerCase()}`
        let ret = await this.ctx.curl(url, options)

        if (ret.status !== 200 || ret.data.success === false) { //返回失败 等待一秒 重试一次
            await this.ctx.service.globalLock.sleep(1000)
            ret = await this.ctx.curl(url, options)

            if (ret.status !== 200 || ret.data.success === false) {  //再次返回失败 抛出异常
                this.ctx.logger.error('kepler接口调用失败', JSON.stringify(ret))
                throwCustomError(ERROR.E_KEPLER_REST_ERROR)
            }
        }
    }

    /**
     * kepler 作业批量操作
     * jobIds: 要操作的作业id，以英文半角逗号分隔，如:  "jobIds=123"  "jobIds=123,456"
     * targetVal: 对于一些需要指定参数的操作将参数作为targetVal传进来
     * https://yuque.antfin-inc.com/docs/share/617a3cc9-b32b-4e48-ab3d-a5a7c31d2bf9
     * @param {*} jobIds
     * @param {*} targetVal
     * @memberof KEPLERNIMBUS
     */
    public async batchOpr (jobIds, oprType) {
        const {ctx} = this
        if (!jobIds || !oprType) {
            throwCustomError(ERROR.E_KEPLER_REST_ERROR, {message: 'batchOpr parameter is null, jobIds：' + jobIds + ', oprType:' + oprType})
        }
        let initParams = await this.service.kepler.getInitParams()
        let initParamsString = Object.keys(initParams).map(key => key + '=' + initParams[key]).join('&')

        let queryParams = ''
        queryParams += 'jobIds=' + jobIds + '&'
        queryParams += 'oprType=' + oprType + '&'

        const options = {
            method: 'GET',
            timeout: 10000,
            dataType: 'json'
        }

        let keplerUrl = await ctx.service.systemConfig.queryByKey('keplerUrl', 'SYSTEM_TEMPLATE')

        let ret

        try {
            let url = `${keplerUrl}/api/job/batchOpr?${queryParams}` + initParamsString
            ret = await ctx.curl(url, options)

            if (ret.status !== 200 || !ret.data || ret.data.success !== true) {
                throwCustomError(ERROR.E_KEPLER_REST_ERROR, {message: 'kepler batchOpr ret:' + JSON.stringify(ret)})
            }
        } catch (err) {
            ctx.logger.error('kepler batchOpr error:', JSON.stringify(err))
        }
        return ret.data.data
    }

    /**
     *  kepler作业状态批量查询
     *
     * @param {*} jobIds
     * @memberof KEPLERNIMBUS
     */
    public async statusByIds (jobIds) {
        const {ctx} = this
        if (!jobIds) {
            throwCustomError(ERROR.E_KEPLER_REST_ERROR, {message: 'statusByIds parameter is null, jobIds：' + jobIds})
        }
        let initParams = await this.service.kepler.getInitParams()
        let initParamsString = Object.keys(initParams).map(key => key + '=' + initParams[key]).join('&')

        let queryParams = ''
        queryParams += 'ids=' + jobIds + '&'

        const options = {
            method: 'GET',
            timeout: 10000,
            dataType: 'json'
        }

        let keplerUrl = await ctx.service.systemConfig.queryByKey('keplerUrl', 'SYSTEM_TEMPLATE')

        let ret

        try {
            let url = `${keplerUrl}/api/job/statusByIds?${queryParams}` + initParamsString

            ret = await ctx.curl(url, options)
            if (ret.status !== 200 || !ret.data || ret.data.success !== true) {
                throwCustomError(ERROR.E_KEPLER_REST_ERROR, {message: 'statusByIds fail, ret:' + JSON.stringify(ret)})
            }
        } catch (err) {
            ctx.logger.error('statusByIds error:', JSON.stringify(err))
        }
        return ret.data.data
    }

    /**
     * 作业资源使用信息 多维度查询
     *
     * @param {string} cluster
     * @param {string} [status='ACTIVE']
     * @param {*} [isMix=undefined]
     * @param {number} [level=2]
     * @param {*} [limit=undefined]
     * @returns
     * @memberof KEPLERNIMBUS
     */
    public async getKeplerApps (cluster:string, status = 'ACTIVE', isMix = undefined, level = '1', limit = 5000) {
        let initParams = await this.service.kepler.getInitParams()
        let initParamsString = Object.keys(initParams).map(key => key + '=' + initParams[key]).join('&')
        let apps = []
        const options = {
            method: 'GET',
            timeout: 10000,
            dataType: 'json'
        }
        let queryParams = ''
        queryParams += cluster ? 'cluster=' + cluster + '&' : ''
        queryParams += status ? 'status=' + status + '&' : ''
        queryParams += isMix !== undefined ? 'isMix=' + isMix + '&' : ''
        queryParams += level ? 'level=' + level + '&' : ''
        queryParams += limit ? 'limit=' + limit + '&' : ''

        let keplerUrl = await this.ctx.service.systemConfig.queryByKey('keplerUrl', 'SYSTEM_TEMPLATE')

        try {
            let url = `${keplerUrl}/api/metrics/resource/jobs?${queryParams}` + initParamsString
            let ret = await this.ctx.curl(url, options)
            if (ret.status !== 200 || !ret.data || ret.data.success !== true) {
                throwCustomError(ERROR.E_KEPLER_REST_ERROR, {message: 'getKeplerApps fail， ret:' + JSON.stringify(ret)})
            }
            apps = ret.data.data
        } catch (err) {
            this.ctx.logger.error('getKeplerApps error:', JSON.stringify(err))
        }
        return apps
    }

    public async getSummary (serviceName) {
        const { ctx } = this
        let data = []
        let serviceRecord = await ServiceDAO.getClusterNameByServiceName(serviceName, ctx)
        let clusterName = serviceRecord.clusterName
        // clusterName = 'kepler_publicet15mixtest'
        /**
         *  jobStatus枚举:ACTIVE, STOP, STARTING, STOPPING, RESTARTING, RESETTING
         */

        let activeApps = await this.getKeplerApps(clusterName, 'ACTIVE')
        let stopApps = await this.getKeplerApps(clusterName, 'STOP')
        let startingApps = await this.getKeplerApps(clusterName, 'STARTING')
        let stoppingApps = await this.getKeplerApps(clusterName, 'STOPPING')
        let restartingApps = await this.getKeplerApps(clusterName, 'RESTARTING')
        let resettingApps = await this.getKeplerApps(clusterName, 'RESETTING')
        data = data.concat(activeApps).concat(stopApps).concat(startingApps)
            .concat(stoppingApps).concat(restartingApps).concat(resettingApps)
        if (data.length) {
            this.ret['data'] = data
        }
    }
}
