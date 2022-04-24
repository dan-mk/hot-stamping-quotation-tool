const GStyle = {
    title: {
        paddingLeft: '15px',
        paddingRight: '15px',
    },
    listContainer: {
        border: '1px solid #d9d9d9',
        borderRadius: '5px',
    },
    subTitle: {
        fontWeight: 'bold',
        marginBottom: '5px',
        padding: '0 15px',

        '& .ant-page-header-heading-title': {
            fontSize: '16px',
        },

        '& .ant-btn': {
            marginTop: '4px',
        }
    },
    listItem: {
        borderRadius: '5px',
        borderBottomColor: '#e2e2e2 !important',
        cursor: 'pointer',
        paddingLeft: '15px',
        paddingRight: '15px',

        '&:hover': {
            backgroundColor: '#fafafa',
        },

        '& .ant-list-item-meta-title': {
            marginBottom: '0',
        },
    },
    formContainer: {
        padding: '0 15px',

        '& .ant-form-item-label': {
            paddingBottom: '0',
        }
    },
};

export default GStyle;
