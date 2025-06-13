import { Router } from "express";
import * as componentController from "../controllers/component.controller";

const router = Router();

router.get("/fetch-ui", componentController.getComponents);
router.post("/create-ui", componentController.createComponent);
router.patch("/refine-ui/:id", componentController.refineComponent);

export default router;
