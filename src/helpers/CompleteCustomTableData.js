export const completeCustomTableData = ({ data, name }) => {
    
    // data = {columns: [], rows: [], totalRows}
    const columns = completeTableColumns({ columns: data.columns, name });
    const rows =    completeTableRows({ rows: data.rows, name });
    return {
        columns, 
        rows,
        name,    
        totalRows: data.totalRows,
        page: data.page,
        perPage: data.perPage,
        randomKey: Math.random() * 100
    };
}; 

/**
 * columns 
 */

const completeTableColumns = ({ columns, name }) => {
    
    columns.forEach(column => {
        column.width = customWidth({ field: column.field, name: name });     
        checkColumnTempKeys(column);
        column.label = customLabel ({ field: column.field }); 
        column.thClass = customClasses ({ field: column.field, sortable: column.sortable });
        
    });
    
    return columns;
};

const customLabel = ({ field }) => 'customTable.'+ field;

export const customClasses = ({ field, sortable }) => {

    const typeClasses = ((field) => {
        
        switch (field) {

            // center
            case 'checkbox': return 'td-text-center';
            case 'currency': return 'td-text-center';
            case 'status': return 'td-text-center';
            case 'message': return 'td-text-center';

            // left
            case 'login': 
            case 'paySystem': return 'td-text-left';
            case 'name': return 'td-text-left';
            case 'roles': return 'td-text-left';
            
            // right
            case 'dateCreate': 
            case 'amount': 
            case 'moderationStatistics': 
            case 'wallet': return 'td-text-right';
            
            default:       return 'td-text-left';
        }
    })(field);
    
    const sortableClasses = sortable ? ' sort' : '';
    
    return typeClasses + sortableClasses;
};

const customWidth = ({ field, name }) => {
    // TODO check table name to add extra column width
    switch (field) {
        case 'checkbox':                return 35;
        case 'user':                    return 200;
        case 'dateCreate':              return 132;
        case 'currency':                return 100;
        case 'amount':                  return 170;
        case 'paySystem':               return 165;
        case 'gateway':                 return 155;
        
        case 'control_small':           return 201;
        case 'control_medium':          return 200;
        case 'control_large':           return 250;
        case 'control':                 return 300;
        
        case 'name':                    return 220;
        case 'roles':                   return 346;
        // case 'roles':                   return 290
        case 'email':                   return 205;
        case 'moderationStatistics':    return 180;
        case 'wallet':                  return 130;
        case 'complexId':               return 135;
        case 'status':                  return 150;
        case 'comment':                 return 60;
        case 'login':                   return 152;

        default:                        return 150;
    }
};

/**
 * rows
 */

const completeTableRows = ({ rows, name }) => {
    // TODO complete rows 
    // rename rows after setting column width
    rows = rows.map(row => checkRowsTempKeys(row));
    return rows;
} ;

export const completedTableWithModerationButtons = ({ data, control, size }) => {
    
    // size: small (1 button) | medium ((2 buttons)) | large(3 buttons)
    const name = 'control';

    // 'control_small'
    const fieldName = fieldNameMethod({ size, name });

    
    const rows = data.rows.map(row => {
        
        // renamed keys = {
        //     id => complexId,
        //     states => moderationStatistics,
        // }
        const newRow = Object.assign(row, { ['complexId']: row['id'] }, { ['moderationStatistics']: row['states'] });
        delete newRow['id'];
        delete newRow['states'];

        row[fieldName] = control ; /* newRow['complexId'].value */
        
        return newRow;
    });
    const columns = data.columns.map(column => {
        
        switch (column.field) {
            case 'id': {
                column.field = 'complexId';
                return column;
            }
            case 'gateway': {
                column.field = 'gateway';
                return column;
            }
            case 'states': {
                column.field = 'moderationStatistics';
                return column;
            }
            default: return column;
        }
    });
    columns.push({ field: fieldName, sortable: false, type: 'string' });

    return {
        rows,
        columns
    };
}; 

export const tableControlsPayload = {
    batchList: {
        buttons: {
            blue: 'verify',
            red: 'cancel',
            gray: 'details'
        },
        // statuses to show active buttons
        conrolStatuses: {
            blue: [ 'new', 'error' ],
            red: [ 'new' ]
        },
    },
    manualReconsiliation: {
        buttons: {
            green: 'paidOut',
            red: 'refuse',
            blue: 'returnWithdraw'
        },
        conrolStatuses: {
            green: [ 'new', 'error' ],
            blue: [ 'new', 'error' ],
            red: [ 'new', 'error' ]
        },
    },
    financesAllWithdrawApplications: {
        buttons: {
            blue: 'toModeration',
            red: 'refuse',
        },
        conrolStatuses: {
            blue: [ 'verified' ],
            red: [ 'new', 'verified' ]
        },
        message: {
            red: true
        }
    }


};

function fieldNameMethod ({ size, name }){ 
    switch (size) {
        case 'small':   return `${name}_${size}`;
        case 'medium':  return `${name}_${size}`;
        case 'large':   return `${name}_${size}`;
        default:        return `${name}`;
    }
}

function checkRowsTempKeys (row) {
    const controlsList = [ 'control_small','control_medium','control_large' ];
        
    for (let index = 0; index < controlsList.length; index++) {
        const currentConrol = controlsList[index];
            
        if (currentConrol in row) {
            row['control'] = { ...row[currentConrol] };
            delete row[currentConrol];
            break;
        }
            
    }
    return row;
}

function checkColumnTempKeys (column) {
    const controlsList = [ 'control_small','control_medium','control_large' ];
    if (controlsList.includes(column.field)) {
        column.field = 'control';
    }
    
    return column;
}