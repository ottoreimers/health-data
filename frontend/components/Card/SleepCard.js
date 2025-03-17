import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  CircularProgress,
  Box,
  Heading,
  Text,
  Grid,
} from "@chakra-ui/react";

import SleepStagesChart from "./SleepStageChart";
import { getLatestSleep } from "@/services/api";

export default function SleepCard() {
  const [sleep, setSleep] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(sleep);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getLatestSleep();
        setSleep(data);
      } catch (err) {
        setError(err.message || "Failed to fetch latest sleep data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatTime = (timeString) => {
    if (!timeString) return "00:00:00";

    if (timeString.includes(":")) {
      const [hours, minutes] = timeString.split(":");
      return `${hours}h ${minutes}m`;
    }
    return timeString;
  };

  return (
    <Box p={5} borderRadius="lg">
      <Heading size="md" mb={4}>
        Latest Sleep Record
      </Heading>
      <Text mb={2}>Date: {new Date(sleep.day).toLocaleDateString()}</Text>

      <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
        <Stat>
          <StatLabel>Total Sleep</StatLabel>
          <StatNumber>{formatTime(sleep.total_sleep)}</StatNumber>
          {sleep.score && (
            <Stat mt={4}>
              <StatLabel>Sleep Score</StatLabel>
              <StatNumber>{sleep.score}</StatNumber>
            </Stat>
          )}
          <Stat>
            <StatLabel>Sleep Quality</StatLabel>
            <StatNumber>{sleep.qualifier}</StatNumber>
          </Stat>
        </Stat>
        <Stat bg="gray.800" p={4} className="rounded-lg">
          <StatLabel>Sleep stages</StatLabel>
          <SleepStagesChart sleep={sleep} />
        </Stat>
      </Grid>
    </Box>
  );
}
