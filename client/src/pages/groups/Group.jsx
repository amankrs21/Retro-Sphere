/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from 'react';
import Grid from '@mui/material/Grid2';
import {
    Typography, Container, Divider, Card, Accordion, AccordionSummary, AccordionDetails, Button
} from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import './Group.css';
import GroupAdd from './GroupAdd';
import GroupMembers from './GroupMembers';
import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../hooks/useLoading';
import { useGetRetroData } from '../../hooks/useGetRetroData';

// Retro page component
export default function Group() {
    document.title = "Retro | Group";

    const { setLoading } = useLoading();
    const { http, userData } = useAuth();
    const { getRetroData } = useGetRetroData();

    const [groups, setGroups] = useState([]);
    const [members, setMembers] = useState({});
    const [openAdd, setOpenAdd] = useState(false);
    const [expanded, setExpanded] = useState(null);
    const [groupChanged, setGroupChanged] = useState(false);

    // Fetch members when a group is expanded
    const fetchMembers = useCallback(async (groupId) => {
        if (!groupId) return;

        setLoading(true);
        try {
            const response = await http.get(`/group/fetch/${groupId}`);
            setMembers((prev) => ({ ...prev, [groupId]: response?.data?.members || [] }));
        } catch (error) {
            console.error("Error fetching members:", error);
        } finally {
            setLoading(false);
        }
    }, [http, setLoading, members]);


    useEffect(() => {
        const localData = JSON.parse(localStorage.getItem('retroData'))?.groups ?? null;
        if (localData) {
            setGroups(localData);
            setExpanded(localData[0]?._id || null);
        } else {
            getRetroData().then((data) => {
                if (data?.groups?.length > 0) {
                    setGroups(data.groups);
                    setExpanded(data.groups[0]?._id || null);
                } else {
                    setGroups([]);
                }
            });
        }
        if (groupChanged) setGroupChanged(false);
    }, [openAdd, groupChanged]);

    useEffect(() => {
        if (expanded) {
            fetchMembers(expanded);
        }
    }, [expanded]);

    return (
        <Container maxWidth="lg">
            {openAdd && <GroupAdd openAdd={openAdd} setOpenAdd={setOpenAdd} />}
            <Grid container justifyContent="space-between" alignItems="center">
                <Typography variant="h4" gutterBottom>
                    Your Groups 📝
                </Typography>

                <Button variant="contained" color="primary" onClick={() => setOpenAdd(true)}>
                    <GroupAddIcon /> &nbsp; Create New
                </Button>
            </Grid>

            <Divider />

            <Card raised sx={{ mt: 2, px: 6, py: 4, backgroundColor: '#f5f5f5' }}>
                {groups.length > 0 ? (
                    groups.map((group) => (
                        <Accordion
                            sx={{ mt: 2 }}
                            key={group._id}
                            expanded={expanded === group._id}
                            onChange={() => setExpanded(group._id)}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Grid container justifyContent="space-between" alignItems="center" width='100%'>
                                    <Typography variant="h6" color="secondary">
                                        <b>Group Name:</b> {group.name}
                                    </Typography>
                                    <Typography variant="h6" color="success" fontWeight={600}>
                                        [{group?.status}]
                                    </Typography>
                                </Grid>
                            </AccordionSummary>
                            <AccordionDetails sx={{ mt: -1 }}>
                                <div className='group-description'>
                                    <Typography variant="body1">
                                        <b>Owner:</b> {group?.ownerEmail}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Created On: <b>{new Date(group?.createdAt).toLocaleString()}</b>
                                    </Typography>
                                </div>
                                <GroupMembers
                                    groupId={group._id}
                                    setGroupChanged={setGroupChanged}
                                    members={members[group._id] || []}
                                    isOwner={group?.ownerEmail === userData?.email}
                                    refreshMembers={() => fetchMembers(group._id)}
                                />
                            </AccordionDetails>
                        </Accordion>
                    ))
                ) : (
                    <Typography variant="h5" align="center" color='warning' sx={{ mt: 1 }}>
                        No groups available. Create a new one!
                    </Typography>
                )}
            </Card>
        </Container>
    );
};
