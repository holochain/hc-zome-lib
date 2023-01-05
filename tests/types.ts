import { Player, Conductor } from '@holochain/tryorama';

export type Profile = {
	agent_address: string;
	nickname?: string;
	avatar_url?: string;
	uniqueness: Buffer;
};

export type InstallAgentsArgs = {
	conductor: Conductor;
	number_of_agents: number;
	not_editable_profile?: boolean;
	memProofHapp?: Player;
	memProofHandler?: any;
};

export type Memproof = {
	signed_header: {
		header: any;
		signature: Buffer;
	};
	entry: any;
};
