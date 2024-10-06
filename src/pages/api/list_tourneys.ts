import { requireDeprecationAcknowledgement } from "../../lib/server/deprecation";
import { listTourneysApi } from "../../lib/server/legacy_api";

export default requireDeprecationAcknowledgement(listTourneysApi);
