import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { DataService } from './data.service';
import { Timeslot, UserEventNote, Slot, Standby, standbyList } from './data';
import { Observable, BehaviorSubject, of} from "rxjs";

export interface DataStandby<standbyList> extends DataSource<standbyList> {
    connect(): Observable<standbyList[]>;
    disconnect(): void;
  }

export class DataStandby<standbyList> implements DataSource<standbyList[]> {

    private standbyDetail = new BehaviorSubject<standbyList[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private dataService: DataService) {}

    connect(): Observable<standbyList[]> {
        return this.standbyDetail.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.standbyDetail.complete();
        this.loadingSubject.complete();
    }

    loadLessons(courseId: number, filter = '',
                sortDirection = 'asc', pageIndex = 0, pageSize = 3) {

        this.loadingSubject.next(true);

        this.coursesService.findLessons(courseId, filter, sortDirection,
            pageIndex, pageSize).pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe(lessons => this.lessonsSubject.next(lessons));
    }    
}


