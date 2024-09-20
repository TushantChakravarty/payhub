import PropTypes from 'prop-types';
import DataTable from '../DataTable';
import dataFormat from "layouts/daily-logs/logs/data";
function logs(props) {
    const { pages, pageSetter, data } = props
    const { columns, rows } = dataFormat(data);
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

logs.propTypes = {
    pages: PropTypes.number,
    pageSetter: PropTypes.func,
    data: PropTypes.array
};

export default logs;
