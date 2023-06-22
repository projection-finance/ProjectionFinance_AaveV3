import prisma from "../../../lib/prisma";

export default async (req, res) => {
  const { path } = req.query;

  if (path == "create") {
    const { projectionPositions, name, tokenPositions, uid, displayAddress} = req.body;
    try {
      const result = await prisma.SimulationAave.create({
        data: {
          name,
          projectionPositions,
          tokenPositions,
          uid,
          displayAddress
        },
      });
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(403).json({ err: "Error while adding new simulation." });
    }
  }

  if (path == "update") {
    const { simulationId, actions, averageGasPerAction } = req.body;
    try {
      const result = await prisma.SimulationAave.update({
        where: { uid: simulationId },
        data: {
          actions,
          averageGasPerAction
        },
      });
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(403).json({ err: "Error while updating simulation." });
    }
  }

  if (path == "read") {
    const { simulationId, skip, take } = req.body;
    try {
      const result = await prisma.SimulationAave.findMany({
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
        where: {
          ...(simulationId ? { uid: simulationId } : {}),
        },
        
      });
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(403).json({ err: "Error while getting simulations." });
    }
  }


  if (path == "delete") {
    const { simulationId } = req.body;
    try {
      const result = await prisma.simulation.delete({
        where: {
          id: parseInt(simulationId),
        },
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(403).json({ err: "Error while deleting simulation." });
    }
  }
};
