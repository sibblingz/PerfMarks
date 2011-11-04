define([ 'tables', 'util/report' ], function (tables, report) {
    function getAgentMetadata() {
        if (typeof window !== 'undefined' && object) {
            return {
                userAgent: window.navigator.userAgent,
                language: window.navigator.language,
                name: document.getElementById('ua-name').value
            };
        } else {
            return null;
        }
    }

    function csvReport(results, agentMetadata) {
        agentMetadata = agentMetadata || getAgentMetadata();

        var reports = [ ];
        if (agentMetadata) {
            reports.push(report.csvByObject(agentMetadata));
        }

        Object.keys(tables.performance).forEach(function (testName) {
            var layout = report.makeTableLayout(tables.performance[testName]);
            reports.push(report.csvByLayout(results[testName], layout, [ testName ]));
        });

        return reports.join('\n\n') + '\n';
    }

    return {
        csvReport: csvReport,
        getAgentMetadata: getAgentMetadata
    };
});
