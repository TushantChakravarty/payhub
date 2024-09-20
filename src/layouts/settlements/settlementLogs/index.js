import PropTypes from 'prop-types';
import DataTable from './DataTable';
import dataFormat from "layouts/settlements/settlementLogs/data";
function SettlementLogs(props) {
    const { pages, pageSetter, logs, downloadInvoice } = props
    const { columns, rows } = dataFormat(logs, downloadInvoice);
    return (
        <DataTable
            table={{ columns, rows }}
            showTotalEntries={false}
            isSorted={false}
            noEndBorder
            entriesPerPage={false}
            pages={pages}
            pageSetter={pageSetter}
        />
    );
}

SettlementLogs.propTypes = {
    pages: PropTypes.number,
    pageSetter: PropTypes.func,
    logs: PropTypes.any,
    downloadInvoice: PropTypes.func
};

export default SettlementLogs;
