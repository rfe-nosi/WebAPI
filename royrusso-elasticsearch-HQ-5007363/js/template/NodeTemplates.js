var nodeTemplate = {};

/**
 * Top area with node-picker or node buttons
 * @type {String}
 */
nodeTemplate.nodeList = [

    '<a href="#nodediagnostics" class="btn btn-info" rel="tipRight" data-trigger="hover" data-placement="bottom" data-title="Provides helpful diagnostic & performance information for all nodes in your cluster."><i class="icon-ambulance"></i> Node Diagnostics</a>',

    '<!-- if more than 5 nodes, show dropdown. else, show individual nodes. -->',
    '<% if (_.size(nodes.models) > 5 ) { %>',
    '<div class="btn-group">',
    '<button class="btn dropdown-toggle btn-info" data-toggle="dropdown" href="#" rel="tipRight" data-trigger="hover" data-placement="right" data-title="Monitor individual nodes in real-time."><i class="icon-th"></i> Monitor Nodes <span class="caret"></span></button> ',
    '<ul class="dropdown-menu">',
    '<% _.each(nodes.models, function(node, key) { %>',
    '<li><a href="#nodes/<%- node.attributes.id %>" data-nodeid="<%- node.id %>">',
    '<% if (node.attributes.master == true) { %>',
    '<i class="icon-bolt"></i> ',
    '<% } %>',
    '<%= node.attributes.name %></a>',
    '<% }); %>',
    '</ul>',

    '<% } else { %>',
    '<% _.each(nodes.models, function(node, key) { %>',
    '<a href="#nodes/<%- node.attributes.id %>" class="btn btn-info" rel="tipRight" data-trigger="hover" data-placement="bottom" data-nodeid="<%- node.id %>"',
    'data-content="<b>IP:</b> <%- node.attributes.transport_address %>.<br/><b>ID:</b> <%- node.id %>" data-html="true" data-title="Click for Node Information.">',
    '<% if (node.attributes.master == true) { %>',
    '<i class="icon-bolt"></i> ',
    '<% } %>',
    '<%= node.attributes.name %></a>',
    '<% }); %>',
    '<% } %>'

].join("\n");

nodeTemplate.nodeShutdown = [
    '<div class="lead text-center" style="padding-top: 20px;">Shutdown Command has been sent to Node.<br/>Click button below to refresh node list.<br/>',
    '<br/><br/><a href="#cluster" class="btn btn-large btn-primary">Click to Continue <i class="icon-chevron-right"></i></a>',
    '</div>'
].join("\n");

nodeTemplate.nodeHotThreads = [
    '<div class="modal hide fade" id="threadModal">',
    '<div class="modal-header">',
    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>',
    '<h3>Modal header</h3>',
    '</div>',
    '<div class="modal-body">',
    '<p>One fine body…</p>',
    '</div>',
    '<div class="modal-footer">',
    '<a href="#" class="btn">Close</a>',
    '<a href="#" class="btn btn-primary">Save changes</a>',
    '</div>',
    '</div>'
].join("\n");

nodeTemplate.nodeInfoModal = [
    '<div class="modal hide fade" id="nodeInfoModal">',
    '<div class="modal-header">',
    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>',
    '<h3>Settings Information</h3>',
    '</div>',
    '<div class="modal-body">',
    '<p>',
    '<table class="table table-condensed table-striped table-bordered">',
    '<tr><td>Node Name:</td><td><%- settings.nodeName %></td></tr>',
    '<tr><td>Node Version:</td><td><%- version %></td></tr>',
    '<tr><td>Node is Master?</td><td><%- settings.nodeMaster %></td></tr>',
    '<tr><td>Node Holds Data?</td><td><%- settings.nodeData %></td></tr>',
    '<tr><td>Cluster Name:</td><td><%- settings.clusterName %></td></tr>',
    '<% if(versionUtil.isNewer("0.99.0", cluster.versionNumber.concat)) { %>',
    '<tr><td>Hostname:</td><td><%- settings.host %></td></tr>',
    '<% } else { %> ',
    '<tr><td>Hostname:</td><td><%- host %></td></tr>',
    '<tr><td>Logger Prefix:</td><td><%- settings.logPrefix %></td></tr>',
    '<% } %>',
    '<tr><td>HTTP Address:</td><td><%- settings.http_address %></td></tr>',
    '<tr><td>Home Path:</td><td><%- settings.pathHome %></td></tr>',
    '<tr><td>Log Path:</td><td><%- settings.logPath %></td></tr>',

    '</table>',
    '</p>',
    '</div>',
    '<div class="modal-footer">',
    '<a href="#" data-dismiss="modal"  class="btn">Close</a>',
    '</div>',
    '</div>',
    '</div>'
].join("\n");

/**
 * Side by side compare of all nodes.
 * @type {String}
 */
nodeTemplate.diagnostics = [
    '<div class="well">',
    '<div class="span2 pull-left"><a href="#refreshNodeDiagnostics" class="btn btn-mini"  rel="tipRight" data-placement="bottom" data-html="true" data-title="Refreshing every <%- polling/1000 %> seconds.<br/>Click to Force Refresh."><i class="icon-refresh"></i> <%- lastUpdateTime %></a></div>',
    '<div class="pull-right">',

    '<div class="btn-group">',
    '<a href="#selectDiagnosticsNodeModal" id="openNodeSelect" class="btn" rel="tipRight" data-placement="bottom" data-html="true" data-title="Monitoring <%- nodes.length %> of <%- allNodes.length %> nodes."><i class="icon-list-ul"></i> Select</a>',
    '<a href="#diagnosticsModal" data-toggle="modal" role="button" class="btn" rel="tipRight" data-placement="bottom" data-html="true" data-title="Trouble understanding this screen?"><i class="icon-question-sign"></i> Help</a></div>',
    '</div>',
    '<div class="text-center">',
    '<span style="font-size: 28px;">Node Diagnostics Information</span>',
    '</div>',
    '</div><!-- well -->',

    '<div class="row-fluid">',
    '<small class="muted"><i class="icon-info-sign"></i> Mouseover each table cell for detailed information.</small>',
    '<table id="nodestable" class="table table-condensed table-bordered nodestable"  style="overflow-x: auto;width: auto;" >',
    '<thead><tr><td colspan="<%- _.size(nodes)+1 %>" class="lead" style="font-weight: bold;"><i class="icon-th-large"></i> Summary</td></tr></thead>',
    '<tbody>',
    '<% _.each(generalRules, function(rule, key) { %>',
    '<tr>',
    '<td style="white-space: nowrap;">',
    '<strong><%- rule.label %></strong>',
    '</td>',
    '<% _.each(nodes, function(node, k) { %>',
    '<td rel="popRight" data-trigger="hover" data-container="#nodestable" data-html="true" data-placement="top" data-title="<b>How this Field is Calculated</b>" data-content="<%- makeDiagnosticsPopOver(node, rule) %>" style="white-space: nowrap; text-align: right;" class="<%- calculateCellClass(node, rule) %>">',
    '<%- calculateRuleValue(node, rule.value, rule.unit, rule.format) %>',
    '</td>',
    '<% }); %>',

    '</tr>',
    '<% }); %>',
    '</tbody>',
    // FS
    '<thead><tr><td colspan="<%- _.size(nodes)+1 %>" style="font-weight: bold;"><i class="icon-th-large"></i> File System</td></tr></thead>',
    '<tbody>',
    '<% _.each(fsRules, function(rule, key) { %>',
    '<tr>',
    '<td style="white-space: nowrap;">',
    '<strong><%- rule.label %></strong>',
    '</td>',
    '<% _.each(nodes, function(node, k) { %>',
    '<td rel="popRight" data-trigger="hover" data-container="#nodestable" data-html="true" data-placement="top" data-title="<b>How this Field is Calculated</b>" data-content="<%- makeDiagnosticsPopOver(node, rule) %>" style="white-space: nowrap; text-align: right;" class="<%- calculateCellClass(node, rule) %>">', '<%- calculateRuleValue(node, rule.value, rule.unit, rule.format) %>',
    '</td>',
    '<% }); %>',
    '</tr>',
    '<% }); %>',
    '</tbody>',
    // ACTIONS
    '<thead><tr><td colspan="<%- _.size(nodes)+1 %>" class="lead" style="font-weight: bold;"><i class="icon-th-large"></i> Index Activity</td></tr></thead>',
    '<tbody>',
    '<% _.each(actionRules, function(rule, key) { %>',
    '<tr>',
    '<td style="white-space: nowrap;">',
    '<strong><%- rule.label %></strong>',
    '</td>',
    '<% _.each(nodes, function(node, k) { %>',
    '<td rel="popRight" data-trigger="hover" data-container="#nodestable" data-html="true" data-placement="top" data-title="<b>How this Field is Calculated</b>" data-content="<%- makeDiagnosticsPopOver(node, rule) %>" style="white-space: nowrap; text-align: right;" class="<%- calculateCellClass(node, rule) %>">',
    '<%- calculateRuleValue(node, rule.value, rule.unit, rule.format) %>',
    '</td>',
    '<% }); %>',
    '</tr>',
    '<% }); %>',
    '</tbody>',
    // CACHE
    '<thead><tr><td colspan="<%- _.size(nodes)+1 %>" class="lead" style="font-weight: bold;"><i class="icon-th-large"></i> Cache Activity</td></tr></thead>',
    '<tbody>',
    '<% _.each(cacheRules, function(rule, key) { %>',
    '<tr>',
    '<td style="white-space: nowrap;">',
    '<strong><%- rule.label %></strong>',
    '</td>',
    '<% _.each(nodes, function(node, k) { %>',
    '<td rel="popRight" data-trigger="hover" data-container="#nodestable" data-html="true" data-placement="top" data-title="<b>About this Field</b>" data-content="<%- makeDiagnosticsPopOver(node, rule) %>" style="white-space: nowrap; text-align: right;" class="<%- calculateCellClass(node, rule) %>">',
    '<%- calculateRuleValue(node, rule.value, rule.unit, rule.format) %>',
    '</td>',
    '<% }); %>',
    '</tr>',
    '<% }); %>',
    '</tbody>',

    // MEMORY
    '<thead><tr><td colspan="<%- _.size(nodes)+1 %>" class="lead" style="font-weight: bold;"><i class="icon-th-large"></i> Memory</td></tr></thead>',
    '<tbody>',
    '<% _.each(memoryRules, function(rule, key) { %>',
    '<tr>',
    '<td style="white-space: nowrap;">',
    '<strong><%- rule.label %></strong>',
    '</td>',
    '<% _.each(nodes, function(node, k) { %>',
    '<td rel="popRight" data-trigger="hover" data-container="#nodestable" data-html="true" data-placement="top" data-title="<b>How this Field is Calculated</b>" data-content="<%- makeDiagnosticsPopOver(node, rule) %>" style="white-space: nowrap; text-align: right;" class="<%- calculateCellClass(node, rule) %>">',
    '<%- calculateRuleValue(node, rule.value, rule.unit, rule.format) %>',
    '</td>',
    '<% }); %>',
    '</tr>',
    '<% }); %>',
    '</tbody>',

    // NETWORK
    '<thead><tr><td colspan="<%- _.size(nodes)+1 %>" class="lead" style="font-weight: bold;"><i class="icon-th-large"></i> Network</td></tr></thead>',
    '<tbody>',
    '<% _.each(networkRules, function(rule, key) { %>',
    '<tr>',
    '<td style="white-space: nowrap;">',
    '<strong><%- rule.label %></strong>',
    '</td>',
    '<% _.each(nodes, function(node, k) { %>',
    '<td rel="popRight" data-trigger="hover" data-container="#nodestable" data-html="true" data-placement="top" data-title="<b>How this Field is Calculated</b>" data-content="<%- makeDiagnosticsPopOver(node, rule) %>" style="white-space: nowrap; text-align: right;" class="<%- calculateCellClass(node, rule) %>">',
    '<%- calculateRuleValue(node, rule.value, rule.unit, rule.format) %>',
    '</td>',
    '<% }); %>',
    '</tr>',
    '<% }); %>',
    '</tbody>',


    '</table>',
    '</div> <!-- row -->',

    '<div class="modal hide fade" id="selectDiagnosticsNodeModal">',
    '<div class="modal-header">',
    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>',
    '<h3>Select Nodes</h3>',
    '</div>',
    '<div class="modal-body" style="overflow-y: visible;">',
    '<div class="alert alert-info" id="selectNodes">',
    '<p>Choose which nodes you would like to diagnose. Note that selecting a large number of nodes, may negatively impact performance.</p>',
    '<form  class="form-inline"><select id="selectedNodes" class="selectpicker" data-style="btn-default" data-selected-text-format="count>5" multiple title="Select Nodes..." data-size="10">',
    '<% _.each(allNodes, function(node, key) { %>',
    '<% if (node.selected == true) { %>',
    '<option selected value="<%- node.id %>"><%- node.name %></option>',
    '<% } else { %>',
    '<option value="<%- node.id %>"><%- node.name %></option>',
    '<% } %>',
    '<% }) %>',
    '</select>',
    '<button class="btn btn-info" id="refreshSelectedNodes">Filter</button>',
    '</form>',
    '</div>',
    '</div>',
    '</div>',

    '<div class="modal hide fade" id="diagnosticsModal">',
    '<div class="modal-header">',
    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>',
    '<h3>About Node Diagnostics</h3>',
    '</div>',
    '<div class="modal-body">',
    '<p>This screen provides helpful information for common metrics and performance problems.</p>',
    '<p><b>Note: Mouseover each table cell for help, calculation logic and values.</b></p>',
    '<p>The color-coding scheme uses threshold ranges to determine acceptable values for each of your node values.</p>',
    '<table class="table table-bordered">',
    '<tr><td class="success">Value is in acceptable range.</td></tr>',
    '<tr><td class="warning">Value is within a warning range.</td></tr>',
    '<tr><td class="error">Value is beyond acceptable levels.</td></tr>',
    '</table> ',
    '</div>',
    '<div class="modal-footer">',
    '<a href="#" class="btn" data-dismiss="modal">Close</a>',
    '</div>',
    '</div>'

].join("\n");

nodeTemplate.jvminfotable = [
    '<div class="span4"> ',
    '<div class="text-center">&nbsp;</div>',
    '<table class="table table-condensed table-striped table-bordered">',
    '<tr><td>Heap Used:</td><td><%- numeral(jvmStats.mem.heap_used_in_bytes).format("0.0b") %></td></tr>',
    '<tr><td>Heap Committed:</td><td><%- numeral(jvmStats.mem.heap_committed_in_bytes).format("0.0b") %></td></tr>',
    '<tr><td>Non Heap Used:</td><td><%- numeral(jvmStats.mem.non_heap_used_in_bytes).format("0.0b") %></td></tr>',
    '<tr><td>Non Heap Committed:</td><td><%- numeral(jvmStats.mem.non_heap_committed_in_bytes).format("0.0b") %></td></tr>',
    '<tr><td>JVM Uptime:</td><td><%- timeUtil.convertMS(jvmStats.uptime_in_millis) %></td></tr>',
    '<tr><td>Thread Count/Peak:</td><td><%- jvmStats.threads.count %> / <%- jvmStats.threads.peak_count %></td></tr>',
    '<% if(versionUtil.isNewer("0.99.0", cluster.versionNumber.concat)) { %>',
    '<tr><td>GC (Old) Count:</td><td><%- jvmStats.gc.collectors.young.collection_count %></td></tr>',
    '<tr><td>GC (Old)Time:</td><td><%- timeUtil.convertMS(jvmStats.gc.collectors.young.collection_time_in_millis) %></td></tr>',
    '<tr><td>GC (Young) Count:</td><td><%- jvmStats.gc.collectors.old.collection_count %></td></tr>',
    '<tr><td>GC (Young)Time:</td><td><%- timeUtil.convertMS(jvmStats.gc.collectors.old.collection_time_in_millis) %></td></tr>',
    '<% } else { %>',
    '<tr><td>GC Count:</td><td><%- jvmStats.gc.collection_count %></td></tr>',
    '<tr><td>GC Time:</td><td><%- timeUtil.convertMS(jvmStats.gc.collection_time_in_millis) %></td></tr>',
    '<% } %>',
    '<tr><td>Java Version:</td><td><%- jvmStats.version %></td></tr>',
    '<tr><td>JVM Vendor:</td><td><%- jvmStats.vm_vendor %></td></tr>',
    '<tr><td>JVM:</td><td><%- jvmStats.vm_name %></td></tr>',
    '</table>',
    '</div>'
].join("\n");

nodeTemplate.nodeInfo = [

    '<div class="modal hide fade" id="killnodemodal">',
    '<div class="modal-header">',
    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>',
    '<h3>WARNING!</h3>',
    '</div>',
    '<div class="modal-body">',
    '<p>Are you sure you want to Shutdown this Node?<br/><br/>You will have to re-start the node manually after this action!</p>',
    '</div>',
    '<div class="modal-footer">',
    '<a href="#" class="btn" data-dismiss="modal">Close</a>',
    '<a href="#shutdownNode/<%- nodeId %>" class="btn btn-danger">Shutdown!</a>',
    '</div>',
    '</div>',

    '<div class="row-fluid"">',


    '<div class="well">',
    '<div class="pull-left"><button id="refreshNodeInfo" class="btn btn-mini"  rel="tipRight" data-placement="bottom" data-html="true" data-title="Refreshing every <%- polling/1000 %> seconds.<br/>Click to Force Refresh."><i class="icon-refresh"></i> <%- lastUpdateTime %></button></div>',
    //'<div class="pull-left" style="line-height: 13px;font-size: 10px;">Refreshed:<br/><%- lastUpdateTime %></div>',

    '<div id="toolbar" class="pull-right">',
    '<div class="btn-group">',
    '<a href="#nodeInfoModal" role="button" data-toggle="modal" class="btn btn-info" rel="tipRight" data-placement="bottom" data-title="Just the Facts, Ma\'am"',
    '><i class="icon-info-sign"></i></a>',
    '<a href="#killnodemodal" data-toggle="modal" role="button" class="btn btn-info" rel="tipRight" data-placement="bottom" data-title="Shutdown Node"><i',
    ' class="icon-off"></i>',
    '</a>',
    '</div> <!-- btn group -->',
    '</div> <!-- toolbar --> ',

    '<div class="text-center">',
    '<span style="font-size: 28px;"><%- nodeName %></span>',
    '</div>',
    '</div><!-- well -->',
    '</div>',

    /*JVM*/
    '<div class="lead text-left"><i class="icon-th-large"></i> JVM</div>',
    '<div class="row-fluid">',
    nodeTemplate.jvminfotable,

    '<div class="span4">',
    '<div class="text-center"><strong>Heap Memory</strong></div>',
    '<div class="chart-container text-center">',
    '<div id="chart-jvmheap" class="chart-placeholder"></div>',
    '<div id="legend"></div>',
    '</div>',
    '</div>',

    '<div class="span4">',
    '<div class="text-center"><strong>Non Heap Memory</strong></div>',
    '<div class="chart-container text-center">',
    '<div id="chart-jvmnonheap" class="chart-placeholder"></div>',
    '<div id="legend"></div>',
    '</div>',
    '</div>',
    '</div>',

    '</div> <!-- end row -->',

    '<ul class="nav nav-list">',
    '<li class="divider"></li>',
    '</ul>',


    /*INDICES*/
    '<div class="lead text-left"><i class="icon-th-large"></i> Indices</div>',
    '<div class="row-fluid">',

    '<div class="span4"> ',
    '<div class="text-center">&nbsp;</div>',
    '<table class="table table-condensed table-striped table-bordered">',
    '<tr><td>Documents:</td><td><%- numeral(indices.docs.count).format("0,0") %></td></tr>',
    '<tr><td>Documents Deleted:</td><td><%- numeral(indices.docs.deleted).format("0,0") %></td></tr>',
    '<tr><td>Store Size:</td><td><%- numeral(indices.store.size_in_bytes).format("0.0b") %></td></tr>',
    '<tr><td>Index Req Total:</td><td><%- numeral(indices.indexing.index_total).format("0,0") %></td></tr>',
    '<tr><td>Delete Req Total:</td><td><%- numeral(indices.indexing.delete_total).format("0,0") %></td></tr>',
    '<tr><td>Get Req Total:</td><td><%- numeral(indices.get.total).format("0,0") %></td></tr>',
    '<tr><td>Get(Exists) Total:</td><td><%- numeral(indices.get.exists_total).format("0,0") %></td></tr>',
    '<tr><td>Get(Missing) Total:</td><td><%- numeral(indices.get.missing_total).format("0,0") %></td></tr>',
    '<tr><td>Query Total:</td><td><%- numeral(indices.search.query_total).format("0,0") %></td></tr>',
    '<tr><td>Fetch Total:</td><td><%- numeral(indices.search.fetch_total).format("0,0") %></td></tr>',
    '</table>',
    '</div>',

    '<div class="span4">',
    '<div class="text-center"><strong>Index Requests Total</strong></div>',
    '<div class="chart-container text-center">',
    '<div id="chart-index" class="chart-placeholder"></div>',
    '<div id="legend"></div>',
    '</div>',
    '</div>',

    '<div class="span4">',
    '<div class="text-center"><strong>Get Requests Total</strong></div>',
    '<div class="chart-container text-center">',
    '<div id="chart-indexget" class="chart-placeholder"></div>',
    '<div id="legend"></div>',
    '</div>',
    '</div>',
    '</div>',

    '</div> <!-- end row -->',

    '<ul class="nav nav-list">',
    '<li class="divider"></li>',
    '</ul>',

    /*OS*/
    '<div class="lead text-left"><i class="icon-th-large"></i> Operating System</div>',
    '<div class="row-fluid">',

    '<div class="span4"> ',
    '<div class="text-center">&nbsp;</div>',
    '<table class="table table-condensed table-striped table-bordered">',
    '<tr><td>Uptime:</td><td><%- timeUtil.convertMS(osStats.uptime_in_millis) %></td></tr>',
    '<tr><td>Total Memory:</td><td><%- osStats.mem.total %></td></tr>',
    '<tr><td>Total Swap:</td><td><%- osStats.swap.total %></td></tr>',
    '<tr><td>Memory (Used/Free):</td><td><%- osStats.mem.used %> / <%- osStats.mem.free %></td></tr>',
    '<tr><td>Swap (Used/Free):</td><td><%- osStats.swap.used %> / <%- osStats.swap.free %></td></tr>',
    '<tr><td>CPU User/Sys:</td><td><%- osStats.cpu.user %>% / <%- osStats.cpu.sys %>%</td></tr>',
    '<tr><td>CPU Idle:</td><td><%- osStats.cpu.idle %>%</td></tr>',
    '<tr><td>CPU Vendor:</td><td><%- osStats.cpu.vendor %></td></tr>',
    '<tr><td>CPU Model:</td><td><%- osStats.cpu.model %></td></tr>',
    '<tr><td>Total Cores:</td><td><%- osStats.cpu.total_cores %></td></tr>',
    '</table>',
    '</div>',

    '<div class="span4">',
    '<div class="text-center"><strong>CPU Usage (%)</strong></div>',
    '<div class="chart-container text-center">',
    '<div id="chart-cpu" class="chart-placeholder"></div>',
    '<div id="legend"></div>',
    '</div>',
    '</div>',

    '<div class="span4">',
    '<div class="text-center"><strong>Memory Usage (GB)</strong></div>',
    '<div class="chart-container text-center">',
    '<div id="chart-mem" class="chart-placeholder"></div>',
    '<div id="legend"></div>',
    '</div>',
    '</div>',
    '</div>',

    '</div> <!-- end row -->',

    '<ul class="nav nav-list">',
    '<li class="divider"></li>',
    '</ul>',


    /* PROCESS */
    '<div class="lead text-left"><i class="icon-th-large"></i> Process</div>',
    '<div class="row-fluid">',

    '<div class="span4"> ',
    '<div class="text-center">&nbsp;</div>',
    '<table class="table table-condensed table-striped table-bordered">',
    '<tr><td>Open File Descriptors:</td><td><%- processStats.open_file_descriptors %></td></tr>',
    '<tr><td>CPU Usage:</td><td><%- processStats.cpu.percent %>% of <%- osStats.max_proc_cpu %>%</td></tr>',
    '<tr><td>CPU System:</td><td><%- timeUtil.convertMS(processStats.cpu.sys_in_millis) %></td></tr>',
    '<tr><td>CPU User:</td><td><%- timeUtil.convertMS(processStats.cpu.user_in_millis) %></td></tr>',
    '<tr><td>CPU Total:</td><td><%- timeUtil.convertMS(processStats.cpu.total_in_millis) %></td></tr>',
    '<tr><td>Resident Memory:</td><td><%- numeral(processStats.mem.resident_in_bytes).format("0.0b") %></td></tr>',
    '<tr><td>Shared Memory:</td><td><%- numeral(processStats.mem.share_in_bytes).format("0.0b") %></td></tr>',
    '<tr><td>Total Virtual Memory:</td><td><%- numeral(processStats.mem.total_virtual_in_bytes).format("0.0b") %></td></tr>',
    '</table>',
    '</div>',

    '<div class="span4">',
    '<div class="text-center"><strong>CPU Usage (%)</strong></div>',
    '<div class="chart-container text-center">',
    '<div id="chart-procpu" class="chart-placeholder"></div>',
    '<div id="legend"></div>',
    '</div>',
    '</div>',

    '<div class="span4">',
    '<div class="text-center"><strong>Memory Usage</strong></div>',
    '<div class="chart-container text-center">',
    '<div id="chart-procmem" class="chart-placeholder"></div>',
    '<div id="legend"></div>',
    '</div>',
    '</div>',
    '</div>',

    '</div> <!-- end row -->',

    '<ul class="nav nav-list">',
    '<li class="divider"></li>',
    '</ul>',

    /* THREADPOOL */
    '<div class="lead text-left"><i class="icon-th-large"></i> Thread Pools</div>',
    '<div class="row-fluid">',

    '<div class="span4"> ',
    '<div class="text-center">&nbsp;</div>',
    '<table class="table table-condensed table-striped table-bordered">',
    '<tr><td>Index (Queue/Peak/Active):</td><td><%- threadPool.index.queue %>/<%- threadPool.index.largest %>/<%- threadPool.index.active%></td></tr>',
    '<tr><td>Get (Queue/Peak/Active):</td><td><%- threadPool.get.queue %>/<%- threadPool.get.largest %>/<%- threadPool.get.active%></td></tr>',
    '<tr><td>Search (Queue/Peak/Active):</td><td><%- threadPool.search.queue %>/<%- threadPool.search.largest %>/<%- threadPool.search.active%></td></tr>',
    '<tr><td>Bulk (Queue/Peak/Active):</td><td><%- threadPool.bulk.queue %>/<%- threadPool.bulk.largest %>/<%- threadPool.bulk.active%></td></tr>',
    '<tr><td>Refresh (Queue/Peak/Active):</td><td><%- threadPool.refresh.queue %>/<%- threadPool.refresh.largest %>/<%- threadPool.refresh.active%></td></tr>',
    '<tr><td>Flush (Queue/Peak/Active):</td><td><%- threadPool.flush.queue %>/<%- threadPool.flush.largest %>/<%- threadPool.flush.active%></td></tr>',
    '<tr><td>Merge (Queue/Peak/Active):</td><td><%- threadPool.merge.queue %>/<%- threadPool.merge.largest %>/<%- threadPool.merge.active%></td></tr>',
    '<tr><td>Management (Queue/Peak/Active):</td><td><%- threadPool.management.queue %>/<%- threadPool.management.largest %>/<%- threadPool.management.active%></td></tr>',
    '</table>',
    '</div>',

    '<div class="span4">',
    '<div class="text-center"><strong>Index Thread Count</strong></div>',
    '<div class="chart-container text-center">',
    '<div id="chart-threadindex" class="chart-placeholder"></div>',
    '<div id="legend"></div>',
    '</div>',
    '</div>',

    '<div class="span4">',
    '<div class="text-center"><strong>Search Thread Count</strong></div>',
    '<div class="chart-container text-center">',
    '<div id="chart-threadsearch" class="chart-placeholder"></div>',
    '<div id="legend"></div>',
    '</div>',
    '</div>',
    '</div>',

    '</div> <!-- end row -->',

    '<ul class="nav nav-list">',
    '<li class="divider"></li>',
    '</ul>',

    /* NETWORK */
    '<div class="lead text-left"><i class="icon-th-large"></i> Network</div>',
    '<div class="row-fluid">',

    '<div class="span4"> ',
    '<div class="text-center">&nbsp;</div>',
    '<table class="table table-condensed table-striped table-bordered">',
    '<tr><td>HTTP Address:</td><td><%- netInfo.http.address %></td></tr>',
    '<tr><td>HTTP Bound Address:</td><td><%- netInfo.http.bound_address %></td></tr>',
    '<tr><td>HTTP Publish Address:</td><td><%- netInfo.http.publish_address %></td></tr>',
    '<tr><td>Transport Address:</td><td><%- netInfo.transport.address %></td></tr>',
    '<tr><td>Transport Bound Address:</td><td><%- netInfo.transport.bound_address %></td></tr>',
    '<tr><td>Transport Publish Address:</td><td><%- netInfo.transport.publish_address %></td></tr>',
    '</table>',
    '</div>',

    '<div class="span4">',
    '<div class="text-center"><strong>Transport TX Count</strong></div>',
    '<div class="chart-container text-center">',
    '<div id="chart-transporttx" class="chart-placeholder"></div>',
    '<div id="legend"></div>',
    '</div>',
    '</div>',

    '<div class="span4">',
    '<div class="text-center"><strong>HTTP Open</strong></div>',
    '<div class="chart-container text-center">',
    '<div id="chart-httpopen" class="chart-placeholder"></div>',
    '<div id="legend"></div>',
    '</div>',
    '</div>',
    '</div>',

    '</div> <!-- end row -->',

    '<ul class="nav nav-list">',
    '<li class="divider"></li>',
    '</ul>',

    /* FS */
    '<div class="lead text-left"><i class="icon-th-large"></i> File System</div>',

    '<% if (_.size(fileSystemArr) > 0) { %>',
    '<% _.each(fileSystemArr, function(fileSystem, count) { %>',
    '<% if (fileSystem != undefined) { %>',
    '<div class="row-fluid">',
    '<div class="span4"> ',
    '<h4>FileSystem <%- count %></h4>',
    '<div class="text-center">&nbsp;</div>',
    '<table class="table table-condensed table-striped table-bordered">',
    '<tr><td>Path:</td><td><%- fileSystem.path %></td></tr>',
    '<tr><td>Mount:</td><td><%- fileSystem.mount %></td></tr>',
    '<tr><td>Device:</td><td><%- fileSystem.dev %></td></tr>',
    '<tr><td>Total Space:</td><td><%- numeral(fileSystem.total_in_bytes).format("0.0b") %></td></tr>',
    '<tr><td>Free Space:</td><td><%- numeral(fileSystem.free_in_bytes).format("0.0b") %></td></tr>',
    '<tr><td>Disk Reads:</td><td><%- numeral(fileSystem.disk_reads).format("0,0") %></td></tr>',
    '<tr><td>Disk Writes:</td><td><%- numeral(fileSystem.disk_writes).format("0,0") %></td></tr>',
    '<tr><td>Read Size:</td><td><%- numeral(fileSystem.disk_read_size_in_bytes).format("0.0b") %></td></tr>',
    '<tr><td>Write Size:</td><td><%- numeral(fileSystem.disk_write_size_in_bytes).format("0.0b") %></td></tr>',
    '</table>',
    '</div>',

    '<div class="span4">',
    '<div class="text-center"><strong># Disk Reads</strong></div>',
    '<div class="chart-container text-center">',
    '<div id="chart-fsreads<%- count %>" class="chart-placeholder"></div>',
    '<div id="legend"></div>',
    '</div>',
    '</div>',

    '<div class="span4">',
    '<div class="text-center"><strong># Disk Writes</strong></div>',
    '<div class="chart-container text-center">',
    '<div id="chart-fswrites<%- count %>" class="chart-placeholder"></div>',
    '<div id="legend"></div>',
    '</div>',
    '</div>',
    '</div>',

    '</div> <!-- end row -->',

    '<ul class="nav nav-list">',
    '<li class="divider"></li>',
    '</ul>',

    '<% } %>',
    '<% }) %>',
    '<% } %>'

].join("\n");