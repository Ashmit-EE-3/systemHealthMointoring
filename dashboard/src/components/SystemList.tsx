import React, { useEffect, useState } from 'react';
import { SystemCheck, SystemQuery } from '../../../client/src/types.ts';
import { fetchSystems } from '../api.ts';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    MenuItem,
    Button,
    CircularProgress,
    Typography,
    Grid,
    Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const boolOptions = [
    { value: '', label: 'Any' },
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' },
];

const SystemList: React.FC = () => {
    const [systems, setSystems] = useState<SystemCheck[]>([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState<SystemQuery>({});
    const [form, setForm] = useState<SystemQuery>({});

    const fetchData = async (q?: SystemQuery) => {
        setLoading(true);
        try {
            const data = await fetchSystems(q);
            setSystems(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFilter = () => {
        setQuery(form);
        fetchData(form);
    };

    return (
        <Box>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>Filter Systems</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={2}>
                        <TextField
                            label="Platform"
                            name="platform"
                            value={form.platform || ''}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <TextField
                            label="Version"
                            name="version"
                            value={form.version || ''}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <TextField
                            select
                            label="Update Status"
                            name="updateStatus"
                            value={form.updateStatus || ''}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                        >
                            {boolOptions.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <TextField
                            select
                            label="Disk Encryption"
                            name="diskEncryption"
                            value={form.diskEncryption || ''}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                        >
                            {boolOptions.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <TextField
                            select
                            label="Antivirus"
                            name="antivirus"
                            value={form.antivirus || ''}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                        >
                            {boolOptions.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <TextField
                            select
                            label="Compliant"
                            name="isCompliant"
                            value={form.isCompliant || ''}
                            onChange={handleInputChange}
                            fullWidth
                            size="small"
                        >
                            {boolOptions.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SearchIcon />}
                            onClick={handleFilter}
                            fullWidth
                            sx={{ height: '40px' }}
                        >
                            Filter
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            <Paper>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                        <CircularProgress />
                    </Box>
                ) : systems.length === 0 ? (
                    <Box p={2}>
                        <Typography>No systems found.</Typography>
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Timestamp</TableCell>
                                    <TableCell>Machine ID</TableCell>
                                    <TableCell>Platform</TableCell>
                                    <TableCell>Version</TableCell>
                                    <TableCell>Update Status</TableCell>
                                    <TableCell>Disk Encryption</TableCell>
                                    <TableCell>Antivirus Present</TableCell>
                                    <TableCell>Antivirus Active</TableCell>
                                    <TableCell>Antivirus Name</TableCell>
                                    <TableCell>Sleep Timeout</TableCell>
                                    <TableCell>Compliant</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {systems.map(system => (
                                    <TableRow key={system.machineId + system.lastCheckIn}>
                                        <TableCell>{new Date(system.lastCheckIn).toLocaleString()}</TableCell>

                                        <TableCell>{system.machineId}</TableCell>
                                        <TableCell>{system.os?.platform}</TableCell>
                                        <TableCell>{system.os?.version}</TableCell>
                                        <TableCell>
                                            {system.os?.updateStatus?.isUpToDate ? (
                                                <CheckCircleIcon color="success" />
                                            ) : (
                                                <Tooltip title="OS is outdated">
                                                    <ErrorIcon color="error" />
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                        {/* <TableCell>{system.security?.diskEncryption?.isEncrypted ? 'Yes' : 'No'}</TableCell> */}
                                        <TableCell>
                                            {system.security?.diskEncryption?.isEncrypted ? (
                                                <CheckCircleIcon color="success" />
                                            ) : (
                                                <Tooltip title="Disk is not encrypted">
                                                    <ErrorIcon color="error" />
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {system.security?.antivirus?.isPresent ? (
                                                <CheckCircleIcon color="success" />
                                            ) : (
                                                <Tooltip title="Antivirus is not present">
                                                    <ErrorIcon color="error" />
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {system.security?.antivirus?.isActive ? (
                                                <CheckCircleIcon color="success" />
                                            ) : (
                                                <Tooltip title="Antivirus is not active">
                                                    <ErrorIcon color="error" />
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                        <TableCell>{system.security?.antivirus?.name}</TableCell>
                                        <TableCell>{system.power?.sleepTimeout}</TableCell>
                                        <TableCell>
                                            {system.power?.isCompliant ? (
                                                <CheckCircleIcon color="success" />
                                            ) : (
                                                <Tooltip title="Device is not compliant">
                                                    <ErrorIcon color="error" />
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Box>
    );
};

export default SystemList;
