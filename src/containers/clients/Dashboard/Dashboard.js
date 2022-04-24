import { Route, Routes } from "react-router-dom";
import { createUseStyles } from 'react-jss';
import { Layout } from 'antd';
import { useNavigate } from "react-router-dom";
import ClientList from './../../clients/ClientList/ClientList';
import ClientForm from './../../clients/ClientForm/ClientForm';
import Client from './../../clients/Client/Client';
import QuotationForm from './../../clients/QuotationForm/QuotationForm';
import Style from "./Style";

const useStyles = createUseStyles(Style);

const { Header, Content } = Layout;

function Dashboard() {
    const classes = useStyles();
    const navigate = useNavigate();

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header className={classes.header}>
                <div className={classes.headerContainer}>
                    <span className={classes.title} onClick={() => navigate('/')}>
                        GARRA
                    </span>
                </div>
            </Header>
            <Layout>
                <Content className={classes.container}>
                    <Routes>
                        <Route path='*' element={'404 Not found'} />
                        <Route path="/" element={<ClientList/>} />
                        <Route path="/new" element={<ClientForm/>} />
                        <Route path="/:id" element={<Client/>} />
                        <Route path="/:id/quotations/new" element={<QuotationForm/>} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
}

export default Dashboard;
