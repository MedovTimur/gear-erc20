import { GearApi, decodeAddress } from '@gear-js/api';
import { TypeRegistry } from '@polkadot/types';
import { TransactionBuilder } from 'sails-js';

export type ActorId = `0x${string}`

export type U256 = bigint

export class ERC20 {
  private registry: TypeRegistry;
  constructor(public api: GearApi, public programId?: `0x${string}`) {
    const types: Record<string, any> = {
      ActorId: "([u8; 32])",
      U256: "([u64; 4])",
    }

    this.registry = new TypeRegistry();
    this.registry.setKnownTypes({ types });
    this.registry.register(types);
  }

  newCtorFromCode(code: Uint8Array | Buffer, name: string, symbol: string, decimals: number | string): TransactionBuilder<null> {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'upload_program',
      ['New', name, symbol, decimals],
      '(String, String, String, u8)',
      'String',
      code,
    );

    this.programId = builder.programId;
    return builder;
  }

  newCtorFromCodeId(codeId: `0x${string}`, name: string, symbol: string, decimals: number | string) {
    const builder = new TransactionBuilder<null>(
      this.api,
      this.registry,
      'create_program',
      ['New', name, symbol, decimals],
      '(String, String, String, u8)',
      'String',
      codeId,
    );

    this.programId = builder.programId;
    return builder;
  }

  public approve(spender: ActorId, value: U256): TransactionBuilder<boolean> {
    return new TransactionBuilder<boolean>(
      this.api,
      this.registry,
      'send_message',
      ['Approve', spender, value],
      '(String, ActorId, U256)',
      'bool',
      this.programId
    );
  }

  public fromTransfer(from: ActorId, to: ActorId, value: U256): TransactionBuilder<boolean> {
    return new TransactionBuilder<boolean>(
      this.api,
      this.registry,
      'send_message',
      ['FromTransfer', from, to, value],
      '(String, ActorId, ActorId, U256)',
      'bool',
      this.programId
    );
  }

  public setBalance(new_balance: U256): TransactionBuilder<boolean> {
    return new TransactionBuilder<boolean>(
      this.api,
      this.registry,
      'send_message',
      ['SetBalance', new_balance],
      '(String, U256)',
      'bool',
      this.programId
    );
  }

  public transfer(to: ActorId, value: U256): TransactionBuilder<boolean> {
    return new TransactionBuilder<boolean>(
      this.api,
      this.registry,
      'send_message',
      ['Transfer', to, value],
      '(String, ActorId, U256)',
      'bool',
      this.programId
    );
  }

  public async allowance(owner: ActorId, spender: ActorId, originAddress: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<U256> {
    const payload = this.registry.createType('(String, ActorId, ActorId)', ['Allowance', owner, spender]).toU8a();
    const reply = await this.api.message.calculateReply({
      destination: this.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this.registry.createType('(String, U256)', reply.payload);
    return result[1].toBigInt() as unknown as U256;
  }

  public async balanceOf(owner: ActorId, originAddress: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<U256> {
    const payload = this.registry.createType('(String, ActorId)', ['BalanceOf', owner]).toU8a();
    const reply = await this.api.message.calculateReply({
      destination: this.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this.registry.createType('(String, U256)', reply.payload);
    return result[1].toBigInt() as unknown as U256;
  }

  public async decimals(originAddress: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<number | string> {
    const payload = this.registry.createType('String', 'Decimals').toU8a();
    const reply = await this.api.message.calculateReply({
      destination: this.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this.registry.createType('(String, u8)', reply.payload);
    return result[1].toNumber() as unknown as number | string;
  }

  public async name(originAddress: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<string> {
    const payload = this.registry.createType('String', 'Name').toU8a();
    const reply = await this.api.message.calculateReply({
      destination: this.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this.registry.createType('(String, String)', reply.payload);
    return result[1].toString() as unknown as string;
  }

  public async symbol(originAddress: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<string> {
    const payload = this.registry.createType('String', 'Symbol').toU8a();
    const reply = await this.api.message.calculateReply({
      destination: this.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this.registry.createType('(String, String)', reply.payload);
    return result[1].toString() as unknown as string;
  }

  public async totalSupply(originAddress: string, value?: number | string | bigint, atBlock?: `0x${string}`): Promise<U256> {
    const payload = this.registry.createType('String', 'TotalSupply').toU8a();
    const reply = await this.api.message.calculateReply({
      destination: this.programId,
      origin: decodeAddress(originAddress),
      payload,
      value: value || 0,
      gasLimit: this.api.blockGasLimit.toBigInt(),
      at: atBlock || null,
    });
    const result = this.registry.createType('(String, U256)', reply.payload);
    return result[1].toBigInt() as unknown as U256;
  }
}