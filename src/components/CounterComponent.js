import {
  Box,
  Button,
  ButtonGroup,
  Center,
  HStack,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import moment from "moment/moment";
import React, { useEffect, useState, useRef } from "react";

function Counter() {
  const [isTimerStart, setIsTimerStart] = useState(false);
  const [isTimerPause, setIsTimerPause] = useState(false);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [laps, setLaps] = useState([]);
  const timer = useRef(null);

  useEffect(() => {
    if (second === 60) {
      setSecond(0);
      setMinute((prev) => prev + 1);
    }
  }, [second]);

  useEffect(() => {
    if (minute === 60) {
      setMinute(0);
      setHour((prev) => prev + 1);
    }
  }, [minute]);

  const startTimerHandller = () => {
    setIsTimerStart(true);
    timer.current = setInterval(() => {
      setSecond((prev) => prev + 1);
    }, 1000);
  };

  const stopTimerHandller = () => {
    clearInterval(timer.current);
    setSecond(0);
    setMinute(0);
    setHour(0);
    setLaps([]);
    setIsTimerStart(false);
  };

  const toggleTimerHandller = () => {
    if (isTimerPause) {
      timer.current = setInterval(() => {
        setSecond((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer.current);
    }
    setIsTimerPause((prev) => !prev);
  };

  const addLapHandller = () => {
    const snapshot = moment(`${hour}:${minute}:${second}`, "H:mm:ss");
    const prevLap = laps.at(-1);
    if (prevLap) {
      const { id, total } = prevLap;
      const duration = moment.duration(
        snapshot.diff(moment(`${total}`, "H:mm:ss"))
      );
      setLaps((prev) => [
        ...prev,
        {
          id: id + 1,
          time: `${parseInt(duration.asHours())}:${
            parseInt(duration.asMinutes()) % 60
          }:${parseInt(duration.asSeconds()) % 60}`,
          total: snapshot.format("H:mm:ss"),
        },
      ]);
    } else {
      setLaps([
        {
          id: 1,
          time: snapshot.format("H:mm:ss"),
          total: snapshot.format("H:mm:ss"),
        },
      ]);
    }
  };

  return (
    <Center h="100vh" w="100vw" flexDirection="column">
      <HStack spacing="16px">
        <Box textAlign="center">
          <Heading>{hour.toString().padStart(2, "0")}</Heading>
          <Text>hr</Text>
        </Box>
        <Box textAlign="center">
          <Heading>{minute.toString().padStart(2, "0")}</Heading>
          <Text>min</Text>
        </Box>
        <Box textAlign="center">
          <Heading>{second.toString().padStart(2, "0")}</Heading>
          <Text>sec</Text>
        </Box>
      </HStack>
      <br />
      <ButtonGroup variant="solid" spacing="16px">
        {isTimerStart ? (
          <React.Fragment>
            <Button onClick={addLapHandller}>Lap</Button>
            <Button onClick={toggleTimerHandller}>
              {isTimerPause ? "Resume" : "Pause"}
            </Button>
            <Button onClick={stopTimerHandller}>Reset</Button>
          </React.Fragment>
        ) : (
          <Button onClick={startTimerHandller}>Start</Button>
        )}
      </ButtonGroup>
      <br />
      <TableContainer minH="300px" maxH="300px" overflowY="scroll">
        <Table>
          <Thead>
            <Tr>
              <Th>Laps</Th>
              <Th>Time</Th>
              <Th>Total</Th>
            </Tr>
          </Thead>
          <Tbody>
            {laps.map((lap) => (
              <Tr key={lap.id}>
                <Td>{lap.id}</Td>
                <Td>{lap.time}</Td>
                <Td>{lap.total}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Center>
  );
}

export default Counter;
