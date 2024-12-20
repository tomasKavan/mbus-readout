import { 
  Entity, 
  ManyToOne, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany
} from "typeorm"
import { SiteCharacteristic } from "./SiteCharacteristic"
import { DataSeriesQhourly } from "./DataSeriesQhourly"
import { DataSeriesHourly } from "./DataSeriesHourly"
import { DataSeriesDaily } from "./DataSeriesDaily"
import { DataSeriesMonthly } from "./DataSeriesMonthly"

export enum ProcessingMethod {
  ADDITION = 'add',
  DIFFERENCE = 'diff',
  AVERAGE = 'avg'
}

@Entity()
export class DataSeries {
  @PrimaryGeneratedColumn()
  public id: number

  @ManyToOne(() => SiteCharacteristic, sc => sc.dataSeries, {
    onDelete: 'RESTRICT',
    nullable: false
  })
  public siteCharacteristic: SiteCharacteristic

  @Column('varchar')
  public name: string

  @Column('varchar', {
    length: 32
  })
  public timezone: string

  @Column('enum', { 
    enum: ProcessingMethod, 
    default: ProcessingMethod.DIFFERENCE 
  })
  public processingMethod: ProcessingMethod

  @Column('datetime', { precision: 0 })
  public lastProcessedUTCQhour: Date

  @Column('datetime', { precision: 0 })
  public updatesProcessedUntilUTCTime: Date

  @Column('boolean', { default: true })
  public processingEnabled: boolean

  @Column('datetime', { 
    precision: 0, 
    default: () => 'CURRENT_TIMESTAMP(0)' 
  })
  public startUTCTime: Date
  
  @Column('datetime', { 
    precision: 0, 
    nullable: true 
  })
  public endUTCTime: Date

  @Column('text')
  public notes: string

  @OneToMany(() => DataSeriesQhourly, dsqh => dsqh.dataSeries)
  public qhourly: Promise<DataSeriesQhourly[]>

  @OneToMany(() => DataSeriesHourly, dsh => dsh.dataSeries)
  public hourly: Promise<DataSeriesHourly[]>

  @OneToMany(() => DataSeriesDaily, dsd => dsd.dataSeries)
  public daily: Promise<DataSeriesDaily[]>

  @OneToMany(() => DataSeriesMonthly, dsm => dsm.dataSeries)
  public monthly: Promise<DataSeriesMonthly[]>

  @CreateDateColumn({
    type: 'datetime',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP(0)'
  })
  createdUTCTime: Date

  @UpdateDateColumn({
    type: 'datetime',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP(0)',
    onUpdate: 'CURRENT_TIMESTAMP(0)'
  })
  updatedUTCTime: Date
}