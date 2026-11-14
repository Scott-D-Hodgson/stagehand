import { planSchemaV1 } from '@stagehand/plan-schema';

interface PlanSchemaWithAxeTags {
  $defs: {
    axeTag: {
      enum: string[];
    };
  };
}

export const axeTagCatalogue = [...(planSchemaV1 as unknown as PlanSchemaWithAxeTags).$defs.axeTag.enum].sort((left, right) => left.localeCompare(right));
