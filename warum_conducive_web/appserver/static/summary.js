require.config({
    paths: {
        "tagmanager": "../app/warum_conducive_web/tagmanager",
        "filter_component": "../app/warum_conducive_web/filter_component"
    },
    shim: {
        "filter_component": {
            deps: [
                "splunkjs/mvc/timerangeview",
                "splunkjs/mvc/radiogroupview",
                "splunkjs/mvc/textinputview",
                "../app/warum_conducive_web/context",
                "tagmanager"
            ]
        },
        "tagmanager": {
            deps: ["jquery"]
        }
    }
});

require([
    "splunkjs/ready!",
    "splunkjs/mvc/simplexml/ready!",
    "underscore", 
    "splunkjs/mvc/chartview",
    "splunkjs/mvc/singleview",
    "filter_component"
], function(
    mvc,
    ignored,
    _,
    ChartView,
    SingleView,
    // TODO: Make this a real require() module and avoid polluting the
    //       global namespace.
    filter_component
) {
    // TODO: Fix the naming conventions
    var timeRange = mvc.Components.getInstance("timerange");
    var trendChart = mvc.Components.getInstance("trend_chart");
    var trendSearch = mvc.Components.getInstance(trendChart.settings.get("managerid"));
    // TODO: Rename "policy_single" to something better
    var single = mvc.Components.getInstance("policy_single");
    var singlesearch = mvc.Components.getInstance(single.settings.get("managerid"));
    var userTable = mvc.Components.getInstance("user_table");
    var documentTable = mvc.Components.getInstance("document_table");
    
    var tokens = mvc.Components.getInstance("default");
    
    generateFilterComponent(mvc);
    
    tokens.set("command", "*");

    trendChart.on("click:legend", function(e) {
        e.preventDefault();
        tokens.set("command", e.name2);
        $("#filter_header").show();
    });

    var menuData = [
        {
            text: 'Include', 
            splunk_action: 'include'
        },
        {
            text: 'Exclude', 
            splunk_action: 'exclude'
            
        },
        {
            text: 'Drilldown', 
            splunk_action: 'drilldown',
            search: "index=* sourcetype=Events $criteria$ | table _time Event_ID User_Name, Computer_Name, Application, Operation, Email_Domain, DNS_Hostname, Source_Directory, Source_File_Extension, Destination_Directory, Destination_File_Extension"
        }
    ];

    // Setup custom contextual menu that appears when clicking on the tables
    context.init({preventDoubleContext: false});
    context.attachToChart(trendChart, menuData);
    context.attachToTable(userTable, menuData);
    context.attachToTable(documentTable, menuData);
});
